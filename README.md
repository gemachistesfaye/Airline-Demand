# Airline Passenger Demand Prediction System ✈️

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview
The **Airline Passenger Demand Prediction System** is a professional-grade machine learning application designed for academic and operational forecasting. It leverages historical monthly passenger data to predict future traffic patterns using a robust Linear Regression model. The system features a clean, white-themed web dashboard for real-time interaction and data visualization.

## ❓ Problem Statement
In the aviation industry, inaccurate demand forecasting leads to resource wastage (fuel, staff) or lost revenue. This project solves the problem by providing an automated, data-driven tool that captures historical trends and seasonal cycles to provide reliable passenger estimates.

## ✨ Key Features
- **Accurate Demand Prediction**: Powered by a finely-tuned Linear Regression model.
- **Smart Feature Engineering**: Includes seasonality, trend indices, and lag variables (lag_1, lag_12).
- **Interactive Dashboard**: A responsive, modern UI built with Vanilla JS and Chart.js.
- **RESTful API**: A Flask-based backend for seamless data exchange.
- **Academic Documentation**: Comprehensive documentation suite for evaluation.

## 🛠️ Technologies Used
- **Language**: Python 3.x
- **ML Libraries**: Scikit-learn, Pandas, Numpy
- **Backend**: Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js

## 📂 Project Structure
```text
project/
│
├── backend/            # Flask API and ML Model
│   ├── app.py          # API Endpoints
│   ├── train.py        # Training Script
│   └── model.pkl       # Saved Model State
│
├── frontend/           # Web Dashboard
│   ├── index.html      # UI Structure
│   ├── style.css       # Clean White Design
│   └── script.js       # UI Logic
│
├── docs/               # Detailed Documentation
│   ├── 01_overview.md  # Introduction
│   ├── ...             # Specific technical docs
│   └── 14_future_work.md
│
└── dataset/            # Data Storage
    └── airline.csv     # Historical Data
```

## 🚀 How to Run

### 1. Prerequisite
Ensure you have Python installed. Install dependencies:
```bash
pip install flask flask-cors pandas scikit-learn
```

### 2. Train the Model
```bash
cd backend
python train.py
```

### 3. Start the Backend
```bash
python app.py
```

### 4. Launch the Dashboard
Simply open `frontend/index.html` in any modern web browser.

## 📊 Sample Output
- **Target**: July 1961
- **Inputs**: Price=$8000, Season=Summer
- **Prediction**: ~463 Passengers
- **Model Confidence**: R² Score > 0.94

## 👥 Team Members
- **Gemachis Tesfaye**: Project Lead, ML Engineer, Full-Stack Developer, Documentation.

---

*For detailed technical information, please refer to the [docs/](docs/) folder.*
