# 05 Feature Engineering

## Overview
Feature engineering is the most critical step in transforming simple time-series data into a format suitable for regression. We converted the `Month` column into several numerical and categorical features.

## Implemented Features

### 1. Temporal Extraction
- **Year**: Extracts the calendar year. This helps the model capture long-term growth (trend).
- **Month**: Extracts the month (1-12). This helps capture recurring monthly patterns.

### 2. Seasonality
- **Season**: Mapping months to categories (Winter, Spring, Summer, Autumn). 
- **Rationale**: Airline demand is highly seasonal. Summer vacations and winter holidays significantly impact passenger numbers differently.

### 3. Time Index (Trend)
- **Calculation**: A sequential integer starting from 0 for the first record.
- **Rationale**: This provides a direct numerical representation of "time passing," allowing the Linear Regression model to fit a slope for the overall trend.

### 4. Lag Features
- **lag_1**: Passenger count from the previous month.
- **lag_12**: Passenger count from the same month of the previous year.
- **Rationale**: Time-series data is autocorrelated. Knowing how many people flew last month (or last year same month) provides a strong predictor for the current month.

### 5. Simulated Features
- **Route**: A categorical variable simulating flight paths (e.g., ADD-DIR).
- **Price**: A dynamic variable where price is simulated to be higher in summer months.
- **Rationale**: In the real world, price and route are primary drivers of demand. These features make the model more realistic and robust.

## Impact on Model
By adding these features, we moved from a simple "passengers over time" view to a multi-dimensional model that understands **when** (season), **how much** (price), and **history** (lags).
