# 11 Results

## Key Findings (V2.0 Analysis)
- **Trend Line**: The mathematical decomposition confirms a strong, consistent upward trend in international passenger demand.
- **Seasonality**: Demand cycles follow a predictable 12-month pattern, with significant peaks during northern hemisphere summer months.
- **Price Sensitivity**: The "What-If" simulations show that passenger demand is moderately sensitive to price fluctuations, which the Linear Regression model captures via the `price` coefficient.

## Model Performance
The system maintains a high degree of precision:
- **R² Score**: ~0.947
- **Mean Absolute Error**: ~14.95 passengers
- **Root Mean Squared Error**: ~18.29 passengers

## Simulation Example
- **Scenario**: 1961 July (Peak Season)
- **High Price ($12k)**: Demand drops to ~420.
- **Low Price ($4k)**: Demand surges to ~510.
- **Result**: The model effectively simulates price elasticity in real-time.
