# SkyCast AI: Airline Passenger Demand Prediction System

A production-level machine learning application for forecasting airline passenger demand using historical data.

## 🚀 Features
- **Predictive Analytics**: Uses Random Forest Regressor to forecast passenger demand.
- **Dynamic Dashboard**: Real-time predictions with interactive Chart.js visualizations.
- **Full-Stack Architecture**: Clean separation between Python/Flask backend and Vanilla JS frontend.
- **Model Management**: Ability to retrain the model directly from the UI.
- **Glassmorphism UI**: Modern, premium design with responsive layout.

## 🛠️ Technology Stack
- **Backend**: Flask, Scikit-learn, Pandas, Numpy.
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+), Chart.js.
- **Machine Learning**: Linear Regression (Baseline), Random Forest (Main).

## 📂 Project Structure
```
airline-ml-system/
│
├── backend/
│   ├── app.py          # Flask API
│   ├── model.py        # Model wrapper
│   ├── train.py        # ML training script
│   ├── utils.py        # Data helpers
│   └── requirements.txt
│
├── frontend/
│   ├── index.html      # UI Structure
│   ├── style.css       # Premium Styling
│   └── script.js       # UI Logic
│
├── dataset/
│   └── airline.csv     # Historical data
│
└── model/
    └── model.pkl       # Serialized best model
```

## ⚙️ Setup & Installation
1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Train the initial model:
   ```bash
   python backend/train.py
   ```
3. Start the backend:
   ```bash
   python backend/app.py
   ```
4. Open `frontend/index.html` in your browser.

## 📈 Model Performance
The Random Forest model is evaluated using R² score, Mean Absolute Error (MAE), and Mean Squared Error (MSE). Performance metrics are visible in the dashboard.
