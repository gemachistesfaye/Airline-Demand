from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import os
import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
import io
import logging

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s  %(levelname)s  %(message)s'
)
logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────────
base_dir   = os.path.dirname(__file__)
MODEL_PATH = os.path.join(base_dir, 'model.pkl')
DATA_PATH  = os.path.join(base_dir, '..', 'dataset', 'airline.csv')

# ── App setup ─────────────────────────────────────────────────────────────────
app = Flask(
    __name__,
    static_folder=os.path.join(base_dir, '..', 'frontend'),
    static_url_path='/'
)
CORS(app)

# ── Load model safely at startup ──────────────────────────────────────────────
try:
    with open(MODEL_PATH, 'rb') as f:
        model_data = pickle.load(f)

    model       = model_data['model']
    metrics     = model_data['metrics']
    features    = model_data['features']
    season_cols = model_data['season_cols']   # e.g. ['season_Autumn','season_Spring','season_Summer']
    last_data   = model_data['last_data']
    full_df     = pd.DataFrame(model_data['full_df'])  # historical data already in pickle

    logger.info(f"Model loaded OK — features: {features}")

except Exception as e:
    logger.error(f"FATAL: could not load model.pkl — {e}")
    model = None

# ── Helper: load reference CSV for lag lookups ────────────────────────────────
def load_reference_df():
    df = pd.read_csv(DATA_PATH)
    df.columns = ['Month', 'Passengers']
    df['Month'] = pd.to_datetime(df['Month'])
    df['year']  = df['Month'].dt.year
    df['month'] = df['Month'].dt.month
    return df

try:
    ref_df = load_reference_df()
except Exception as e:
    logger.warning(f"Could not load reference CSV: {e}")
    ref_df = None

# ── Helper: get season name from month number ─────────────────────────────────
def get_season_name(month):
    if month in [12, 1, 2]:  return 'Winter'
    if month in [3,  4, 5]:  return 'Spring'
    if month in [6,  7, 8]:  return 'Summer'
    return 'Autumn'

# ── Helper: build one-hot season dict matching train.py dummy columns ─────────
def build_season_dummies(month):
    season = get_season_name(month)
    # Winter is the dropped/reference category — all zeros
    return {col: int(col == f'season_{season}') for col in season_cols}

# ── Helper: look up a historical passenger count ──────────────────────────────
def lookup_passengers(year, month, fallback):
    if ref_df is None:
        return fallback
    row = ref_df[(ref_df['year'] == year) & (ref_df['month'] == month)]
    if len(row) > 0:
        return float(row['Passengers'].values[0])
    return fallback

# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Run train.py first.', 'status': 'error'}), 503

    try:
        data = request.json

        # ── Parse inputs ──────────────────────────────────────────────────────
        year  = int(data.get('year',  1961))
        month = int(data.get('month', 1))

        # ── Validate inputs ───────────────────────────────────────────────────
        if not (1949 <= year <= 2030):
            return jsonify({'error': 'Year must be between 1949 and 2030', 'status': 'error'}), 400
        if not (1 <= month <= 12):
            return jsonify({'error': 'Month must be between 1 and 12', 'status': 'error'}), 400

        # ── Time index (same formula as train.py) ─────────────────────────────
        base_year  = 1949
        time_index = (year - base_year) * 12 + (month - 1)

        # ── Lag features — look up real historical values where possible ───────
        # lag_1  = passengers in the previous month
        prev_month = month - 1 if month > 1 else 12
        prev_year  = year if month > 1 else year - 1
        lag_1 = lookup_passengers(prev_year, prev_month, fallback=float(last_data['Passengers']))

        # lag_12 = passengers in the same month one year ago
        lag_12 = lookup_passengers(year - 1, month, fallback=float(last_data['Passengers']))

        # ── Season one-hot dummies (matches train.py get_dummies output) ───────
        season_dummies = build_season_dummies(month)

        # ── Assemble input row in exact feature order ─────────────────────────
        row = {
            'year':       year,
            'month':      month,
            'time_index': time_index,
            'lag_1':      lag_1,
            'lag_12':     lag_12,
        }
        row.update(season_dummies)

        input_df   = pd.DataFrame([row])
        prediction = model.predict(input_df[features])[0]

        logger.info(f"Prediction: year={year} month={month} season={get_season_name(month)} "
                    f"lag_1={lag_1:.0f} lag_12={lag_12:.0f} → {prediction:.0f}")

        return jsonify({
            'prediction': round(float(prediction), 2),
            'season':     get_season_name(month),
            'status':     'success'
        })

    except Exception as e:
        logger.error(f"/predict error: {e}")
        return jsonify({'error': str(e), 'status': 'error'}), 400


@app.route('/data', methods=['GET'])
def get_data():
    try:
        # Use the data already loaded from the pickle — no need to re-read CSV
        return jsonify(full_df.to_dict(orient='records'))
    except Exception as e:
        logger.error(f"/data error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/metrics', methods=['GET'])
def get_metrics():
    try:
        clean = {}
        for k, v in metrics.items():
            clean[k] = v.item() if hasattr(v, 'item') else v
        return jsonify(clean)
    except Exception as e:
        logger.error(f"/metrics error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/decompose', methods=['GET'])
def decompose():
    try:
        df = pd.read_csv(DATA_PATH)
        df.columns = ['Month', 'Passengers']
        df['Month'] = pd.to_datetime(df['Month'])
        df.set_index('Month', inplace=True)

        result = seasonal_decompose(df['Passengers'], model='additive', period=12)

        return jsonify({
            'labels':   df.index.strftime('%Y-%m').tolist(),
            'trend':    result.trend.fillna(0).tolist(),
            'seasonal': result.seasonal.tolist(),
            'resid':    result.resid.fillna(0).tolist(),
            'observed': df['Passengers'].tolist(),
        })

    except Exception as e:
        logger.error(f"/decompose error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/export', methods=['POST'])
def export():
    try:
        data        = request.json
        predictions = data.get('predictions', [])

        if not predictions:
            return jsonify({'error': 'No predictions provided', 'status': 'error'}), 400

        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='xlsxwriter')

        df = pd.DataFrame(predictions)
        df.to_excel(writer, index=False, sheet_name='Forecast')

        writer.close()
        output.seek(0)

        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='Airline_Demand_Forecast.xlsx'
        )

    except Exception as e:
        logger.error(f"/export error: {e}")
        return jsonify({'error': str(e)}), 500


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=False, port=5000)