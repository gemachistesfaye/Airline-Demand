# 09 Backend API

## Framework
The backend is built using **Flask**, a lightweight and flexible Python web framework.

## API Endpoints

### 1. `POST /predict`
- **Purpose**: Receives input features and returns a demand forecast.
- **Input JSON**:
  ```json
  { "year": 1961, "month": 7, "price": 8000 }
  ```
- **Response**:
  ```json
  { "prediction": 463.2, "status": "success" }
  ```

### 2. `GET /data`
- **Purpose**: Fetches the full historical dataset for visualization on the dashboard.
- **Response**: Array of monthly passenger records.

### 3. `GET /metrics`
- **Purpose**: Returns the model's performance statistics (MAE, RMSE, R²).

## Key Features
- **CORS Enabled**: Cross-Origin Resource Sharing is enabled to allow the frontend to communicate with the API from different domains/ports.
- **Error Handling**: Graceful handling of invalid inputs or internal server errors with appropriate JSON error messages.
- **Model Persistence**: Loads the pre-trained model once at startup for high performance.
