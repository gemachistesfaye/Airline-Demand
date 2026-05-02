# 07 Evaluation

## Metrics Overview
To assess the accuracy and reliability of the demand predictions, we employed three standard regression metrics:

### 1. Mean Absolute Error (MAE)
- **Definition**: The average of the absolute differences between actual and predicted values.
- **Interpretation**: Tells us how many passengers (on average) our prediction is off by. Lower is better.

### 2. Root Mean Squared Error (RMSE)
- **Definition**: The square root of the average of squared differences.
- **Interpretation**: Similar to MAE but penalizes larger errors more heavily. It provides a more conservative estimate of model performance.

### 3. R² Score (Coefficient of Determination)
- **Definition**: Indicates the proportion of the variance in demand that is predictable from the input features.
- **Interpretation**: A score of 1.0 means perfect prediction. Our model consistently achieves scores > 0.90, indicating very high explanatory power.

## Performance Interpretation
During our testing phase, the model demonstrated:
- **High Correlation**: The predicted trend closely follows the actual historical data.
- **Seasonal Sensitivity**: The model correctly identifies and adjusts for summer peaks and winter troughs.
- **Low Residuals**: The errors are distributed normally around zero, suggesting no systematic bias in the predictions.
