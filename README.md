# Airline Demand Prediction System

This project aims to predict airline passenger demand using a Linear Regression model. It is designed as a clean starting point for a university-level data science project.

## Folder Structure

- **data/**: Contains the dataset (`passengers.csv`).
- **src/**: Source code for the prediction system (`main.py`).
- **notebooks/**: Jupyter notebooks for exploratory data analysis (EDA).
- **outputs/**: Storage for generated plots and model evaluation results.

## Getting Started

1. **Dataset**: Place your dataset file named `passengers.csv` inside the `data/` folder.
2. **Environment**: Install the required libraries using:
   ```bash
   pip install -r requirements.txt
   ```
3. **Execution**: Run the main script from the project root:
   ```bash
   python src/main.py
   ```

## Model Features
The system uses the following features for prediction:
- **Time**: Chronological index.
- **Month_num**: Seasonal indicator.
- **Year**: Long-term trend indicator.
- **Prev_Passengers**: Previous month's passenger count (Lag feature).
