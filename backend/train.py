import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os


def get_season(month):
    if month in [12, 1, 2]:
        return 'Winter'
    if month in [3, 4, 5]:
        return 'Spring'
    if month in [6, 7, 8]:
        return 'Summer'
    return 'Autumn'


def train_model():
    # ── 1. Load dataset ──────────────────────────────────────────────────────
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, '..', 'dataset', 'airline.csv')

    df = pd.read_csv(data_path)
    df.columns = ['Month', 'Passengers']

    # ── 2. Parse dates and extract time components ───────────────────────────
    df['Month'] = pd.to_datetime(df['Month'])
    df['year']  = df['Month'].dt.year
    df['month'] = df['Month'].dt.month

    # ── 3. Season — one-hot encoded (avoids ordinal bias) ────────────────────
    #    Winter=ref category (dropped), Spring/Summer/Autumn get dummy columns
    df['season_name'] = df['month'].apply(get_season)
    df = pd.get_dummies(df, columns=['season_name'], prefix='season', drop_first=True)
    season_cols = sorted([c for c in df.columns if c.startswith('season_')])

    # ── 4. Trend index ────────────────────────────────────────────────────────
    df['time_index'] = np.arange(len(df))

    # ── 5. Lag features (captures momentum + annual seasonality) ─────────────
    df['lag_1']  = df['Passengers'].shift(1)   # previous month
    df['lag_12'] = df['Passengers'].shift(12)  # same month last year

    # ── 6. Drop rows with NaN from lag creation ───────────────────────────────
    df = df.dropna().reset_index(drop=True)

    # ── 7. Define features and target ─────────────────────────────────────────
    #    NOTE: price removed — it was fully synthetic and added no real signal
    features = ['year', 'month', 'time_index', 'lag_1', 'lag_12'] + season_cols
    X = df[features]
    y = df['Passengers']

    print(f"Dataset: {len(df)} usable rows, {len(features)} features")
    print(f"Features: {features}")

    # ── 8. Time-series cross-validation (5 folds) ────────────────────────────
    #    shuffle=False is mandatory for time-series — preserves chronological order
    tscv = TimeSeriesSplit(n_splits=5)
    cv_r2, cv_mae, cv_rmse = [], [], []

    for fold, (train_idx, test_idx) in enumerate(tscv.split(X), 1):
        X_tr, X_te = X.iloc[train_idx], X.iloc[test_idx]
        y_tr, y_te = y.iloc[train_idx], y.iloc[test_idx]

        m = LinearRegression()
        m.fit(X_tr, y_tr)
        preds = m.predict(X_te)

        fold_r2   = r2_score(y_te, preds)
        fold_mae  = mean_absolute_error(y_te, preds)
        fold_rmse = np.sqrt(mean_squared_error(y_te, preds))

        cv_r2.append(fold_r2)
        cv_mae.append(fold_mae)
        cv_rmse.append(fold_rmse)

        print(f"  Fold {fold}: R²={fold_r2:.3f}  MAE={fold_mae:.2f}  RMSE={fold_rmse:.2f}  "
              f"(train={len(train_idx)}, test={len(test_idx)})")

    print(f"\nCross-validation summary:")
    print(f"  R²   — mean: {np.mean(cv_r2):.3f}  std: {np.std(cv_r2):.3f}")
    print(f"  MAE  — mean: {np.mean(cv_mae):.2f}  std: {np.std(cv_mae):.2f}")
    print(f"  RMSE — mean: {np.mean(cv_rmse):.2f}  std: {np.std(cv_rmse):.2f}")

    # ── 9. Final model — train on ALL data ───────────────────────────────────
    #    After validating with CV, fit on the full dataset for best inference
    final_model = LinearRegression()
    final_model.fit(X, y)

    # Report final in-sample metrics (for dashboard display)
    final_preds = final_model.predict(X)
    final_metrics = {
        'mae':       float(mean_absolute_error(y, final_preds)),
        'rmse':      float(np.sqrt(mean_squared_error(y, final_preds))),
        'r2':        float(r2_score(y, final_preds)),
        'cv_r2_mean':  float(np.mean(cv_r2)),
        'cv_r2_std':   float(np.std(cv_r2)),
        'cv_mae_mean': float(np.mean(cv_mae)),
        'cv_rmse_mean':float(np.mean(cv_rmse)),
    }

    print(f"\nFinal model (trained on full dataset):")
    print(f"  R²={final_metrics['r2']:.3f}  MAE={final_metrics['mae']:.2f}  RMSE={final_metrics['rmse']:.2f}")

    # ── 10. Save model + all metadata needed by app.py ───────────────────────
    model_data = {
        'model':       final_model,
        'metrics':     final_metrics,
        'features':    features,
        'season_cols': season_cols,          # app.py needs this to build input_df
        'last_data':   df.iloc[-1].to_dict(), # used for lag defaults in inference
        'full_df':     df[['year', 'month', 'Passengers']].to_dict(orient='records'),
    }

    model_path = os.path.join(base_dir, 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)

    print(f"\nModel saved → backend/model.pkl")
    print(f"Season columns saved: {season_cols}")


if __name__ == '__main__':
    train_model()