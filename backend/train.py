import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os

def get_season(month):
    if month in [12, 1, 2]: return 'Winter'
    if month in [3, 4, 5]: return 'Spring'
    if month in [6, 7, 8]: return 'Summer'
    return 'Autumn'

def train_model():
    # Load dataset
    data_path = os.path.join('..', 'dataset', 'airline.csv')
    df = pd.read_csv(data_path)
    df.columns = ['Month', 'Passengers']
    
    # 1. Convert Month to datetime
    df['Month'] = pd.to_datetime(df['Month'])
    
    # 2. Extract year and month
    df['year'] = df['Month'].dt.year
    df['month'] = df['Month'].dt.month
    
    # 3. Create features
    # Season (Mapping to numeric for regression)
    df['season_name'] = df['month'].apply(get_season)
    # Convert to dummies or numeric mapping
    season_map = {'Winter': 0, 'Spring': 1, 'Summer': 2, 'Autumn': 3}
    df['season'] = df['season_name'].map(season_map)
    
    # time_index (trend)
    df['time_index'] = np.arange(len(df))
    
    # lag features
    df['lag_1'] = df['Passengers'].shift(1)
    df['lag_12'] = df['Passengers'].shift(12)
    
    # 4. Simulated features
    # Price: higher in summer (month 6,7,8), lower otherwise
    df['price'] = df.apply(lambda x: 8000 if x['month'] in [6,7,8] else 4000, axis=1)
    # Add some noise to price for realism
    np.random.seed(42)
    df['price'] += np.random.normal(0, 500, len(df))
    
    # Drop missing values
    df = df.dropna()
    
    # Define features and target
    features = ['year', 'month', 'season', 'time_index', 'lag_1', 'lag_12', 'price']
    X = df[features]
    y = df['Passengers']
    
    # Split (no shuffle)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    # Train Linear Regression
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Evaluate
    preds = model.predict(X_test)
    metrics = {
        'mae': mean_absolute_error(y_test, preds),
        'rmse': np.sqrt(mean_squared_error(y_test, preds)),
        'r2': r2_score(y_test, preds)
    }
    
    print(f"Metrics: {metrics}")
    
    # Save model and feature info
    model_data = {
        'model': model,
        'metrics': metrics,
        'features': features,
        'last_data': df.iloc[-1].to_dict() # Useful for lag calculation
    }
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("Model saved to backend/model.pkl")

if __name__ == "__main__":
    train_model()
