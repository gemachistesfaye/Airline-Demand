# 11 Results

## Key Findings
- **Predictability**: Passenger demand in this dataset is highly predictable using historical trends and seasonal cycles.
- **Trend Dominance**: The long-term year-over-year growth is the strongest predictor of demand.
- **Seasonality peaks**: Demand consistently peaks in July and August, which the model captures accurately.

## Visual Evidence
The system's dashboard successfully overlays the predicted values on top of historical trends, demonstrating a high degree of "fit." Even with a simple Linear Regression model, the error margins (MAE) remain low enough for practical operational planning.

## Sample Predictions
- **Input**: Year=1961, Month=July, Price=8000
- **Output**: ~463 Passengers
- **Context**: This aligns with the expected growth curve continuing from the 1960 data points.
