# 06 Model

## Selected Algorithm: Linear Regression
The system uses **Ordinary Least Squares (OLS) Linear Regression** as the core predictive engine.

## Why Linear Regression?
1. **Interpretability**: It is easy to see how each feature (e.g., price or year) affects the final prediction through its coefficient.
2. **Efficiency**: Training and prediction are computationally inexpensive, allowing for real-time responsiveness.
3. **Baseline Excellence**: For time-series with clear trends like the AirPassengers dataset, a linear model often provides a highly accurate and stable baseline before moving to more complex non-linear models.

## How It Works
Linear Regression finds the "best-fit line" by minimizing the sum of squared differences between the predicted and actual passenger counts. 

The mathematical form is:
`Demand = β₀ + β₁(Year) + β₂(Month) + β₃(Price) + ... + ε`

- **β coefficients**: These represent the "weight" or importance of each feature. For example, a positive coefficient for `Year` indicates a growing trend.
- **ε (Error)**: The model accounts for noise in the data that cannot be explained by the input features.

## Implementation Detail
We used `scikit-learn`'s `LinearRegression` class. The model was trained on 80% of the data and tested on the remaining 20% using a non-shuffled split to preserve the temporal order of observations.

### Environment & Reproducibility
For maximum stability and compatibility with NumPy/Pandas C-extensions, this model is trained and served using **Python 3.11**. 

To retrain the model locally:
```powershell
& C:/Users/HP/AppData/Local/Programs/Python/Python311/python.exe "c:/Users/HP/Desktop/AI Project/backend/train.py"
```
