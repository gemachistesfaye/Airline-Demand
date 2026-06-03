# 04 Dataset

## Data Source
The primary data used for this project was sourced from **Kaggle**, specifically utilizing the industry-standard "Air Passengers" dataset. This dataset is widely recognized for time-series forecasting benchmarks.

## Dataset Characteristics
- **Total Observations**: 144 Months.
- **Time Range**: January 1949 to December 1960.
- **Primary Feature**: `#Passengers` (Total number of passengers in thousands).
- **Secondary Features**: Created during the engineering phase (Year, Month, Season).

## Data Quality & Integrity
The dataset was verified for the following:
- **No Missing Values**: Each of the 144 entries contains a valid passenger count.
- **Consistency**: Monthly reporting intervals are uniform throughout the series.
- **Trend and Seasonality**: The data exhibits a clear upward trend and a strong multiplicative seasonal component, making it ideal for the **AeroDemand AI** model.

## Pre-processing Steps
1. **Cleaning**: Processed using a data engineering pipeline to ensure correct data types.
2. **Indexing**: Converted temporal data into numerical indices for mathematical processing.
3. **Storage**: The dataset is stored as a CSV file in the `/dataset` directory of the project.
