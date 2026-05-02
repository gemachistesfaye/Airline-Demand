import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

def load_data(filepath):
    """
    Load the dataset from the specified CSV file.
    Expects: data/passengers.csv
    """
    # TODO: Load dataset using pandas
    pass

def preprocess_data(df):
    """
    Handle date conversion and initial cleaning.
    """
    # TODO: Convert date column to datetime objects
    pass

def feature_engineering(df):
    """
    Create features for the model:
    - Time: Numerical index for time
    - Month_num: Extract month from date
    - Year: Extract year from date
    - Prev_Passengers: Lagged feature for previous month's demand
    """
    # TODO: Generate numerical features and lagged passenger counts
    pass

def train_model(X_train, y_train):
    """
    Initialize and train the Linear Regression model.
    """
    # TODO: Fit the sklearn LinearRegression model
    pass

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model using MSE and R2 scores.
    """
    # TODO: Calculate and print evaluation metrics
    pass

def plot_results(y_test, y_pred):
    """
    Visualize actual vs predicted demand.
    """
    # TODO: Create a plot comparing test data with predictions
    pass

def main():
    print("--- Airline Demand Prediction System ---")
    
    # 1. Load Dataset
    # df = load_data("data/passengers.csv")
    
    # 2. Preprocessing
    # df = preprocess_data(df)
    
    # 3. Feature Engineering
    # df = feature_engineering(df)
    
    # 4. Split Data
    # X = df[['Time', 'Month_num', 'Year', 'Prev_Passengers']]
    # y = df['Passengers']
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 5. Training
    # model = train_model(X_train, y_train)
    
    # 6. Evaluation
    # evaluate_model(model, X_test, y_test)
    
    # 7. Visualization
    # plot_results(y_test, y_pred)

if __name__ == "__main__":
    main()
