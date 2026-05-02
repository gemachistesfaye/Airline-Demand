# 14 Future Work

## Potential Enhancements

### 1. Advanced Modeling
- **Non-Linear Models**: Exploring XGBoost or Random Forest for capturing more complex interactions.
- **Deep Learning**: Implementing LSTM (Long Short-Term Memory) networks for better long-term sequence prediction.

### 2. Feature Expansion
- **Holiday Data**: Incorporating specific public holidays for different regions.
- **Economic Indicators**: Adding GDP or fuel price data as exogenous variables.
- **Weather Data**: Integrating weather patterns that might cause flight cancellations or demand shifts.

### 3. System Features
- **User Authentication**: Securing the dashboard and API.
- **Batch Predictions**: Allowing users to upload CSV files for bulk demand forecasting.
- **Automated Retraining**: Implementing a pipeline that automatically updates the model when new monthly data is added.

### 4. Deployment
- **Cloud Hosting**: Deploying the system on AWS/GCP or Heroku for public accessibility.
- **Dockerization**: Containerizing the backend and frontend for easier cross-platform deployment.
