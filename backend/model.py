import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import os

def prepare_and_train():
    # 1. Load dataset
    # Get the directory where this script is located
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'AirPassengers.csv')
    df = pd.read_csv(data_path)
    
    # 2. Rename #Passengers to Passengers
    df.rename(columns={'#Passengers': 'Passengers'}, inplace=True)
    
    # 3. Convert Month to datetime
    df['Month'] = pd.to_datetime(df['Month'])
    
    # 4. Feature Engineering
    # - Time (index for trend)
    df['Time'] = np.arange(len(df))
    # - Month number (seasonality)
    df['Month_num'] = df['Month'].dt.month
    # - Year
    df['Year'] = df['Month'].dt.year
    # - Previous month passengers (lag feature)
    df['Prev_Passengers'] = df['Passengers'].shift(1)
    
    # Drop first row as it has NaN for Prev_Passengers
    df = df.dropna()
    
    # 5. Split data into X and y
    # Features: Time, Month_num, Year, Prev_Passengers
    X = df[['Time', 'Month_num', 'Year', 'Prev_Passengers']]
    y = df['Passengers']
    
    # Train-Test Split (80/20)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    # 6. Train Linear Regression model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # 7. Evaluate model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Trained. MSE: {mse:.2f}, R2: {r2:.2f}")
    
    # 8. Generate Predictions for the whole dataset
    df['Predicted'] = model.predict(X)
    
    # 9. Save results for frontend usage
    outputs_dir = os.path.join(base_dir, 'outputs')
    if not os.path.exists(outputs_dir):
        os.makedirs(outputs_dir)
        
    df.to_csv(os.path.join(outputs_dir, 'results.csv'), index=False)
    
    # Generate graph.png
    plt.figure(figsize=(12, 6))
    plt.plot(df['Month'], df['Passengers'], label='Actual', color='blue')
    plt.plot(df['Month'], df['Predicted'], label='Predicted', color='red', linestyle='--')
    plt.title('Airline Passenger Demand: Actual vs Predicted')
    plt.xlabel('Time')
    plt.ylabel('Passengers')
    plt.legend()
    plt.grid(True)
    plt.savefig(os.path.join(outputs_dir, 'graph.png'))
    plt.close()
    
    return model, mse, r2

if __name__ == "__main__":
    prepare_and_train()
