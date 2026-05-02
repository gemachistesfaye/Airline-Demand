# SkyCast Pro | Airline Passenger Demand Prediction System ✈️

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview
**SkyCast Pro** (V2.0) is an advanced, production-level machine learning application for forecasting airline passenger demand. It provides not just predictions, but deep analytical insights through seasonal decomposition and real-time scenario simulation.

## ✨ Pro Features (V2.0)
- **Advanced Predictive Analytics**: Powered by a robust Linear Regression model with a 94.7% R² accuracy.
- **Seasonal Decomposition**: View the "Trend" and "Seasonal" components of your data separately using industry-standard additive decomposition.
- **Scenario "What-If" Analysis**: Use the real-time **Price Slider** to see how changing ticket prices affects predicted passenger volume instantly.
- **Premium UI/UX**:
  - **Dark Mode**: Toggle between a clean professional white theme and a high-contrast dark theme.
  - **Dynamic Visuals**: Fully interactive charts powered by Chart.js.
- **Export Capabilities**: Download your forecast reports directly to **Excel (.xlsx)** for executive meetings.
- **RESTful API**: Enhanced Flask backend with specialized endpoints for decomposition and data export.

## 🛠️ Technology Stack
- **Backend**: Python 3.11, Flask, Statsmodels, Pandas, XlsxWriter.
- **Frontend**: HTML5, CSS3 (Modern Flex/Grid), Vanilla JavaScript, Chart.js.

## 📂 Project Structure
```text
project/
│
├── backend/            # Advanced Python API
│   ├── app.py          # Pro API Endpoints (Predict, Decompose, Export)
│   ├── train.py        # Optimized ML Training Script
│   └── model.pkl       # Serialized Linear Regression Model
│
├── frontend/           # Pro Dashboard
│   ├── index.html      # Responsive UI with Dark Mode support
│   ├── style.css       # Dynamic Theming & Glassmorphism components
│   └── script.js       # Real-time state management & Chart logic
│
├── docs/               # Full Academic Documentation Suite
└── dataset/            # Historical Data Storage
```

## 🚀 How to Run

### 1. Prerequisites
Install the advanced dependency stack:
```bash
pip install flask flask-cors pandas scikit-learn statsmodels xlsxwriter
```

### 2. Train the Model
```powershell
& C:/Users/HP/AppData/Local/Programs/Python/Python311/python.exe "c:/Users/HP/Desktop/AI Project/backend/train.py"
```

### 3. Start the Backend
```powershell
& C:/Users/HP/AppData/Local/Programs/Python/Python311/python.exe "c:/Users/HP/Desktop/AI Project/backend/app.py"
```

### 4. Launch the Dashboard
Open `frontend/index.html` in your browser. Use the **Theme Toggle** in the top right to switch between Light and Dark modes.

## 👥 Team Members
- **Gemachis Tesfaye**: Lead ML Architect, Full-Stack Developer, Documentation Specialist.

---

*Explore the `docs/` folder for 14+ pages of detailed technical documentation.*
