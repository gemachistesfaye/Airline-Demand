# 09 Backend API

## Framework
The backend is built using **Flask**, enhanced with **Statsmodels** for analytics and **XlsxWriter** for report generation.

## API Endpoints (Pro V2.0)

### 1. `POST /predict`
- **Purpose**: Real-time forecast based on time index and price.
- **Input**: `{ "year": int, "month": int, "price": float }`

### 2. `GET /decompose`
- **Purpose**: Performs a mathematical decomposition of the passenger data.
- **Output**: Returns JSON containing `trend`, `seasonal` and `residual` components.
- **Technology**: Uses `statsmodels.tsa.seasonal.seasonal_decompose`.

### 3. `POST /export`
- **Purpose**: Generates an Excel report of the latest predictions.
- **Input**: `{ "predictions": list }`
- **Output**: Serves an `.xlsx` file as a direct download.

### 4. `GET /data` & `GET /metrics`
- **Purpose**: Returns historical data and model performance stats (MAE, RMSE, R²).

## Reliability Features
- **Stateless Analysis**: Decomposition is calculated on-the-fly to ensure it always reflects the latest state of the dataset.
- **Memory Efficient**: Excel reports are generated in an in-memory buffer (`io.BytesIO`) before being served, ensuring no temporary files clutter the server.
