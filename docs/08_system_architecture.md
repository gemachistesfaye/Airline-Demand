# 08 System Architecture

## Architectural Pattern
The system follows a modular, decoupled architecture with an enhanced **Python/Flask Backend** serving a **Dynamic Vanilla JS Frontend**.

## System Flow (V2.0 Enhanced)

### 1. Data Layer
- **Source**: `airline.csv`
- **Action**: Used for training, visualization and as the input for the decomposition engine.

### 2. Processing Layer (Analytics Engine)
- **Feature Engineering**: Standard extraction of year, month and lags.
- **Decomposition Engine**: Uses `statsmodels` to perform additive seasonal decomposition, calculating Trend and Seasonal cycles.

### 3. Model Layer
- **Action**: A Linear Regression model handles the core prediction logic, specifically trained to account for price sensitivity.

### 4. API Layer (Enhanced Flask)
- **Endpoint `/predict`**: Real-time prediction with price influence.
- **Endpoint `/decompose`**: Returns trend and seasonal arrays.
- **Endpoint `/export`**: Generates and serves an Excel file using `xlsxwriter`.

### 5. Frontend Layer (Pro Dashboard)
- **What-If Controller**: Monitors the price slider and triggers asynchronous updates.
- **Theme Engine**: Manages CSS variables for Light/Dark mode switching.
- **Visuals**: Multi-chart layout showing Demand, Trend and Seasonality.

## Deployment View
```text
[ Dataset ] -> [ Analytics Engine ] -> [ model.pkl ]
                      |
[ User ] <-> [ Pro Dashboard (Dark/Light) ] <-> [ Enhanced API ]
                                                   |
                                            [ Excel Generator ]
```
