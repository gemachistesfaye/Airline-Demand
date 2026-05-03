# 05 Feature Engineering

## Transforming Raw Data into Intelligence
To achieve high prediction accuracy, **AeroDemand AI** transforms simple date-passenger pairs into a multidimensional feature space.

## Key Features Implemented

### 1. Temporal Indexing
- **Year & Month**: Extracted as numerical inputs.
- **Time Index**: A continuous integer (0 to 143) representing the absolute time passed. This allows the Linear Regression model to "see" the long-term growth trend.

### 2. Seasonal Mapping
Instead of treating months as random numbers, we mapped them into four distinct seasons:
- **Winter (0)**: December, January, February.
- **Spring (1)**: March, April, May.
- **Summer (2)**: June, July, August.
- **Autumn (3)**: September, October, November.
*This allows the model to anticipate "Summer Spikes" and "Winter Troughs" in passenger traffic.*

### 3. Price Influence (Elasticity)
We introduced a price feature to simulate demand sensitivity. While not in the original Kaggle set, it was added to the **AeroDemand AI** pipeline to allow for scenario-based forecasting and professional business simulation.

### 4. Lag Features
- **Lag_1**: Passengers from the previous month.
- **Lag_12**: Passengers from the same month in the previous year.
*Lags help the model understand autocorrelation—the concept that demand today is highly related to demand yesterday and last year.*
