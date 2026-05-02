from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model and info
base_dir = os.path.dirname(__file__)
MODEL_PATH = os.path.join(base_dir, 'model.pkl')
DATA_PATH = os.path.join(base_dir, '..', 'dataset', 'airline.csv')

with open(MODEL_PATH, 'rb') as f:
    model_data = pickle.load(f)

model = model_data['model']
metrics = model_data['metrics']
features = model_data['features']
last_data = model_data['last_data']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        year = int(data.get('year', 1961))
        month = int(data.get('month', 1))
        price = float(data.get('price', 6000))

        # Prepare features for LR
        # We need: year, month, season, time_index, lag_1, lag_12, price
        season_map = {12: 0, 1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3}
        season = season_map.get(month, 0)
        
        # Approximate time_index (starting from index 144 for 1961-01)
        # dataset has 144 rows (1949-01 to 1960-12)
        base_year = 1949
        time_index = (year - base_year) * 12 + (month - 1)
        
        # For demo purposes, we'll use last known lags if predicting near the end
        # or just provide some defaults if it's way into the future
        lag_1 = data.get('lag_1', last_data['Passengers'])
        lag_12 = data.get('lag_12', 417) # 1960-01 passengers was 417

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
    # Convert numpy types to native python types for JSON serialization
    clean_metrics = {}
    for k, v in metrics.items():
        if hasattr(v, 'item'):
            clean_metrics[k] = v.item()
        else:
            clean_metrics[k] = v
    return jsonify(clean_metrics)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
