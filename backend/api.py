from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import joblib
from model import prepare_and_train

app = Flask(__name__)
CORS(app) # Enable CORS for frontend interaction

# Load or train model on startup
print("Initializing Airline Demand Prediction System...")
current_dir = os.path.dirname(os.path.abspath(__file__))
outputs_dir = os.path.join(current_dir, 'outputs')
model_path = os.path.join(outputs_dir, 'model.pkl')
results_path = os.path.join(outputs_dir, 'results.csv')
metrics_path = os.path.join(outputs_dir, 'metrics.pkl')

if os.path.exists(model_path) and os.path.exists(results_path):
    print("Found existing model and results. Loading from disk...")
    model = joblib.load(model_path)
    metrics = joblib.load(metrics_path)
    mse = metrics['mse']
    r2 = metrics['r2']
else:
    print("No existing model found. Training fresh model...")
    model, mse, r2 = prepare_and_train()

@app.route('/data', methods=['GET'])
def get_data():
    """Returns the historical data and predictions for visualization."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    results_path = os.path.join(current_dir, 'outputs', 'results.csv')
    if not os.path.exists(results_path):
        return jsonify({"error": "Data not found"}), 404
    
    df = pd.read_csv(results_path)
    # Convert to JSON friendly format
    data = df.to_dict(orient='records')
    return jsonify({
        "data": data,
        "metrics": {
            "mse": round(mse, 2),
            "r2": round(r2, 2)
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predicts passengers for a specific month and year."""
    content = request.json
    month = int(content.get('month'))
    year = int(content.get('year'))
    
    # We need to estimate Time and Prev_Passengers for this new point
    # For a simple university project, we can find the closest historical point
    current_dir = os.path.dirname(os.path.abspath(__file__))
    results_path = os.path.join(current_dir, 'outputs', 'results.csv')
    df = pd.read_csv(results_path)
    df['Month'] = pd.to_datetime(df['Month'])
    
    # Sort by date
    df = df.sort_values('Month')
    
    # Simple logic: If it's a future date, we increment from the last known date
    last_row = df.iloc[-1]
    last_date = pd.to_datetime(last_row['Month'])
    target_date = pd.to_datetime(f"{year}-{month}-01")
    
    months_diff = (target_date.year - last_date.year) * 12 + (target_date.month - last_date.month)
    
    if months_diff <= 0:
        # If it's in the past or current, just find the closest match
        closest = df[df['Month'] == target_date]
        if not closest.empty:
            prediction = float(closest['Predicted'].values[0])
            actual = float(closest['Passengers'].values[0])
            return jsonify({"prediction": round(prediction, 1), "actual": actual})
        else:
            # If not exact match, treat as new
            pass

    # For new/future predictions:
    # Time = last_time + months_diff
    # Month_num = month
    # Year = year
    # Prev_Passengers = approximate (using last prediction as prev)
    
    time_val = last_row['Time'] + months_diff
    prev_passengers = last_row['Passengers'] # Simplified
    
    features = np.array([[time_val, month, year, prev_passengers]])
    prediction = model.predict(features)[0]
    
    return jsonify({
        "prediction": round(float(prediction), 1),
        "target_date": target_date.strftime('%Y-%m')
    })

if __name__ == '__main__':
    # use_reloader=False stops Flask from restarting when files in backend/outputs change
    app.run(debug=True, port=5000, use_reloader=False)
