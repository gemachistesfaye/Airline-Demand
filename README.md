# 🛫 AeroDemand AI: Airline Passenger Demand Prediction System

[![Version](https://img.shields.io/badge/Version-1.0.4-blue.svg)](https://github.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-green.svg)](https://flask.palletsprojects.com/)
[![UI/UX](https://img.shields.io/badge/UI/UX-Professional-orange.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

**AeroDemand AI** is a state-of-the-art, production-grade analytics platform designed for high-precision airline passenger demand forecasting. Built for both university excellence and real-world deployment, it leverages advanced machine learning to transform historical data into actionable insights.

---

## 🚀 Core Objectives
- **Predictive Accuracy**: Utilize Linear Regression with seasonal decomposition to forecast demand.
- **Data Visualization**: Provide intuitive, interactive charts using Chart.js.
- **Enterprise Experience**: Deliver a professional, clean and responsive dashboard interface.
- **Scalable Architecture**: Decoupled frontend-backend communication via RESTful APIs.

## ✨ Key Features
- 📊 **Intelligent Dashboard**: Real-time overview of historical trends and model accuracy scores.
- 🔮 **Advanced Forecaster**: Multi-parameter prediction engine (Year, Month, Price) with automatic season detection.
- 📈 **Deep Analytics**: Dynamic line and bar charts visualizing seasonal cycles and long-term trends.
- 💎 **Premium UI**: Modern navy/slate theme, sleek typography (Inter) and glassmorphism elements.
- ⚡ **Asynchronous Logic**: Zero-reload experience using Vanilla JS and Fetch API.

## 🛠️ Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.11, Flask, Scikit-Learn, Statsmodels, Pandas, NumPy |
| **Frontend** | HTML5, Tailwind CSS (CDN), Vanilla JavaScript, Chart.js, FontAwesome |
| **API** | RESTful JSON Endpoints |
| **DevOps** | Modular structure, Virtual Environment support |

## 📂 Project Organization
```text
AeroDemand-AI/
├── backend/            # Intelligence Core (Flask + ML)
│   ├── app.py          # REST API & Route Logic
│   ├── train.py        # Model Training Pipeline
│   └── model.pkl       # Serialized ML Model
├── frontend/           # Presentation Layer
│   ├── css/            # UI Design System (Tailwind + Custom)
│   ├── js/             # Application Logic (Vanilla JS)
│   └── index.html      # Single Page Dashboard
├── docs/               # Technical Documentation (14-page suite)
└── dataset/            # Historical Airline Data
```

## 🛠️ Technical Highlights
- **ML Precision**: Utilizes a Linear Regression model with a focus on temporal feature engineering, achieving an R² score of ~0.94.
- **Dynamic UI**: A high-performance SPA (Single Page Application) architecture ensuring sub-second response times.
- **Seasonality Engine**: Custom logic to handle cyclical airline demand patterns (Summer peaks, Winter troughs).
- **Responsive Design**: Fluid layout optimized for desktop analytics and mobile monitoring.

## 🏁 Quick Start Guide

### 1. Initialize the Intelligence Layer
Run the Flask server to activate the predictive endpoints:
```powershell
python backend/app.py
```

### 2. Launch the Dashboard
Simply open the following file in any modern web browser:
`frontend/index.html`

## 👥 Professional Team
- **Gemachis Tesfaye**: Project Lead & ML Architect
- **Sisay Tasew**: Backend Integration

> [!TIP]
> For the complete list of team members and their detailed technical contributions, please refer to the [Team Contribution Report](docs/13_team_contribution.md).

---

> [!NOTE]
> This system was developed as a flagship project for university submission, demonstrating industry-level software engineering and machine learning principles.

© 2026 University Academic Project
