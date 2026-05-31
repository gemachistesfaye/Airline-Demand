# 🛫 AeroDemand AI — Airline Passenger Demand Forecasting

[![Version](https://img.shields.io/badge/Version-1.0.4-blue.svg)](#)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4-F7931E.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7.svg?logo=render&logoColor=white)](https://aerodemand-ai.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6.svg)](https://opensource.org/licenses/MIT)

> **AeroDemand AI** is a production-grade, full-stack machine learning platform that forecasts airline passenger demand using Linear Regression with time-series cross-validation. It features a live REST API, an interactive analytics dashboard, and is fully deployed on Render.

### 🌐 Live Demo → [https://aerodemand-ai.onrender.com](https://aerodemand-ai.onrender.com)

> ⚠️ Hosted on Render free tier — first load may take ~30 seconds to wake up.

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://raw.githubusercontent.com/gemachistesfaye/AeroDemand-AI/main/docs/screenshots/dashboard.png)
*Real-time stats: Avg. Monthly Passengers, Model R² score and Historical Demand Trend chart — all loaded live from the API.*

### Demand Forecaster
![Predictions](https://raw.githubusercontent.com/gemachistesfaye/AeroDemand-AI/main/docs/screenshots/predictions.png)
*Select a year and month → automatic season detection → instant passenger volume prediction.*

### Performance Analytics
![Analytics](https://raw.githubusercontent.com/gemachistesfaye/AeroDemand-AI/main/docs/screenshots/analytics.png)
*MAE, RMSE, R² Score, Full Passenger Trend chart, Seasonal Distribution bar chart and 5-fold Cross-Validation summary.*

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Live Dashboard** | Avg. passengers, R² score and trend chart loaded live from `/metrics` and `/data` |
| 🔮 **Demand Forecaster** | Predict passenger volume by year + month with auto season detection |
| 📈 **Full Analytics** | Trend chart, seasonal bar chart, CV mean R²/MAE/RMSE |
| 🤖 **ML Pipeline** | Linear Regression + lag features + one-hot season encoding + 5-fold TimeSeriesSplit |
| 📤 **Excel Export** | Download forecast results as `.xlsx` via `/export` endpoint |
| 🌐 **REST API** | 5 JSON endpoints — predict, data, metrics, decompose, export |
| 💎 **Premium UI** | Navy/slate SPA, Inter font, glassmorphism cards, fully responsive |
| ⚡ **Zero-reload** | Vanilla JS + Fetch API, no framework needed |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.11, Flask 3.1, Flask-CORS, Gunicorn |
| **Machine Learning** | Scikit-Learn, Statsmodels, Pandas, NumPy |
| **Frontend** | HTML5, Tailwind CSS (CDN), Vanilla JavaScript, Chart.js, Font Awesome |
| **API** | RESTful JSON — `/predict` `/data` `/metrics` `/decompose` `/export` |
| **Deployment** | Render (free tier), `.python-version` pinned to 3.11 |

---

## 🤖 Machine Learning Details

| Property | Value |
|---|---|
| Algorithm | Linear Regression |
| Dataset | AirPassengers — 144 monthly observations (1949–1960) |
| Features | `year`, `month`, `time_index`, `lag_1`, `lag_12`, `season_Spring`, `season_Summer`, `season_Autumn` |
| Season encoding | One-hot dummy variables (Winter = reference category) |
| Validation | 5-fold TimeSeriesSplit (chronological, no data leakage) |
| R² Score | **0.987** (full dataset) |
| CV Mean R² | **0.749** (cross-validated — honest estimate) |
| MAE | **10.21** passengers |
| RMSE | **13.08** passengers |

> The gap between full-dataset R² (0.987) and CV R² (0.749) is expected — the dataset only has 131 usable rows after lag feature creation. The CV score is the honest generalization estimate.

---

## 📂 Project Structure

```
AeroDemand-AI/
├── backend/
│   ├── app.py              # Flask REST API — 5 endpoints
│   └── train.py            # ML training pipeline with CV
├── frontend/
│   ├── css/
│   │   └── style.css       # Custom styles + spinner
│   ├── js/
│   │   └── app.js          # SPA logic — navigation, charts, API calls
│   └── index.html          # Single Page Dashboard
├── dataset/
│   └── airline.csv         # 144 monthly passenger observations
├── docs/                   # 14-page technical documentation suite
├── requirements.txt        # Python dependencies (pinned versions)
├── Procfile                # Gunicorn start command for Render
├── render.yaml             # Render deployment config
├── .python-version         # Pins Python 3.11.0
└── README.md
```

---

## 🏁 Quick Start (Local)

### Prerequisites
- Python 3.11+
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/gemachistesfaye/AeroDemand-AI.git
cd AeroDemand-AI

# 2. Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Train the model (MUST run before starting the server)
python backend/train.py

# 5. Start the server
python backend/app.py

# 6. Open in your browser
# http://localhost:5000
```

---

## 🔌 API Reference

All endpoints return JSON. The server runs on port 5000 locally.

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/predict` | Predict passenger demand | `{"year": 1961, "month": 7}` |
| `GET` | `/data` | Historical passenger data | — |
| `GET` | `/metrics` | Model performance metrics | — |
| `GET` | `/decompose` | Seasonal decomposition | — |
| `POST` | `/export` | Download forecast as Excel | `{"predictions": [...]}` |

### Example prediction request

```bash
curl -X POST https://aerodemand-ai.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"year": 1962, "month": 7}'
```

### Example response

```json
{
  "prediction": 543.21,
  "season": "Summer",
  "status": "success"
}
```

---

## 🚀 Deployment

The app is deployed on **Render** with Flask serving both the frontend and backend from a single URL.

```
https://aerodemand-ai.onrender.com        ← Dashboard (index.html)
https://aerodemand-ai.onrender.com/predict ← Prediction API
https://aerodemand-ai.onrender.com/metrics ← Model metrics
```

Render auto-deploys on every push to `main`. The build command runs `train.py` to regenerate the model before starting Gunicorn.

---

## 👥 Team

| Name | Role |
|---|---|
| **Gemachis Tesfaye** | Project Lead & ML Architect |
| **Sisay Tasew** | Backend Integration |

> For detailed individual contributions see [`docs/13_team_contribution.md`](docs/13_team_contribution.md)

---

## 📄 License

MIT License © 2026 — University Academic Project