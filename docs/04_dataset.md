# 04 Dataset

## Source
The system utilizes the standard "AirPassengers" dataset, a well-known time-series dataset containing monthly passenger totals from 1949 to 1960.

## Structure
The raw dataset consists of two columns:
- **Month**: Date in `YYYY-MM` format.
- **#Passengers**: Integer count of international airline passengers (in thousands).

## Dataset Characteristics
- **Total Rows**: 144
- **Time Span**: 12 years (144 months)
- **Trend**: Clear upward linear/exponential trend over time.
- **Seasonality**: Strong yearly seasonality with peaks usually occurring in the summer months (July/August).

## Preprocessing Steps
- Parsing the `Month` column into a `datetime` object.
- Renaming columns for standardized access.
- Sorting by date to ensure correct lag feature generation.
