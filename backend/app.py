from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import os
import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
import io

# Load model and info
base_dir = os.path.dirname(__file__)
app = Flask(__name__, static_folder=os.path.join(base_dir, '..', 'frontend'), static_url_path='/')
CORS(app)

MODEL_PATH = os.path.join(base_dir, 'model.pkl')
DATA_PATH = os.path.join(base_dir, '..', 'dataset', 'airline.csv')

with open(MODEL_PATH, 'rb') as f:
    model_data = pickle.load(f)

model = model_data['model']
metrics = model_data['metrics']
features = model_data['features']
last_data = model_data['last_data']

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        year = int(data.get('year', 1961))
        month = int(data.get('month', 1))
        price = float(data.get('price', 6000))

        season_map = {12: 0, 1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3}
        season = season_map.get(month, 0)
        
        base_year = 1949
        time_index = (year - base_year) * 12 + (month - 1)
        
        lag_1 = data.get('lag_1', last_data['Passengers'])
        lag_12 = data.get('lag_12', 417)

        input_df = pd.DataFrame([{
            'year': year,
            'month': month,
            'season': season,
            'time_index': time_index,
            'lag_1': lag_1,
            'lag_12': lag_12,
            'price': price
        }])

        prediction = model.predict(input_df[features])[0]
        
        return jsonify({
            'prediction': round(float(prediction), 2),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400

@app.route('/data', methods=['GET'])
def get_data():
    try:
        df = pd.read_csv(DATA_PATH)
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    clean_metrics = {}
    for k, v in metrics.items():
        if hasattr(v, 'item'):
            clean_metrics[k] = v.item()
        else:
            clean_metrics[k] = v
    return jsonify(clean_metrics)

@app.route('/decompose', methods=['GET'])
def decompose():
    try:
        df = pd.read_csv(DATA_PATH)
        df['Month'] = pd.to_datetime(df['Month'])
        df.set_index('Month', inplace=True)
        
        result = seasonal_decompose(df['#Passengers'], model='additive', period=12)
        
        return jsonify({
            'labels': df.index.strftime('%Y-%m').tolist(),
            'trend': result.trend.fillna(0).tolist(),
            'seasonal': result.seasonal.tolist(),
            'resid': result.resid.fillna(0).tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/export', methods=['POST'])
def export():
    try:
        data = request.json
        predictions = data.get('predictions', [])
        
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        
        df = pd.DataFrame(predictions)
        df.to_excel(writer, index=False, sheet_name='Forecast')
        
        writer.close()
        output.seek(0)
        
        return send_file(output, 
                         mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         as_attachment=True,
                         download_name='Airline_Demand_Forecast.xlsx')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
