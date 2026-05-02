# ✈️ Airline Demand Prediction System

A professional full-stack machine learning application that predicts airline passenger demand using historical data and a Linear Regression model.

## 🧠 Tech Stack

- **Backend**: Python, Flask, Pandas, Scikit-Learn
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Visualization**: Chart.js
- **Model**: Linear Regression (Time-series forecasting approach)

## 📁 Project Structure

```text
Airline-Demand/
├── data/
│   └── AirPassengers.csv     # Historical passenger data
├── backend/
│   ├── model.py             # Machine Learning pipeline
│   └── api.py               # Flask REST API
├── frontend/
│   ├── index.html           # Dashboard UI
│   ├── style.css            # Custom Styling
│   └── script.js            # Frontend Logic & Charting
├── outputs/
│   ├── results.csv          # Processed data with predictions
│   └── graph.png            # Static visualization
├── README.md
└── requirements.txt         # Dependencies
```

## ⚙️ How to Run

### 1. Setup Backend
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the API server:
   ```bash
   python backend/api.py
   ```
   *The server will run on `http://127.0.0.1:5000`.*

### 2. Launch Frontend
1. Open `frontend/index.html` in your web browser.
2. (Recommended) Use a local server like "Live Server" in VS Code for the best experience.

## 📊 Model Description
The system uses **Linear Regression** to model the relationship between time-based features and passenger demand. 

### Features Engineered:
- **Time**: A linear trend feature.
- **Month_num**: Captures monthly seasonality.
- **Year**: Captures long-term growth.
- **Prev_Passengers**: Lag feature representing the previous month's demand.

**Equation:** `y = b₀ + b₁x₁ + b₂x₂ + b₃x₃ + b₄x₄`

## ✨ Features
- **Dynamic Dashboard**: Real-time visualization of actual vs predicted demand.
- **Interactive Prediction**: Predict demand for any future month/year.
- **Model Metrics**: Displays R² score to show model accuracy.
- **Responsive UI**: Works on desktop and mobile.
