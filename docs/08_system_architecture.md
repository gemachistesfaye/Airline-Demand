# 08 System Architecture

## Architectural Pattern
The system follows a modular, decoupled architecture consisting of a **Backend API** and a **Client-Side Frontend**.

## System Flow

### 1. Data Layer
- **Source**: `airline.csv`
- **Action**: Data is loaded by the training script and the API for historical visualization.

### 2. Processing Layer (Feature Engineering)
- **Action**: Raw data is passed through a transformation pipeline where date components are extracted, and lag/seasonal features are calculated.

### 3. Model Layer
- **Action**: The preprocessed data trains a `LinearRegression` model. The final model state is serialized into a `model.pkl` file for persistence.

### 4. API Layer (Flask)
- **Action**: A Flask server loads the `model.pkl`. It listens for HTTP requests (POST for predictions, GET for data). It performs the necessary feature extraction on user inputs before passing them to the model.

### 5. Frontend Layer (UI)
- **Action**: A vanilla JavaScript dashboard provides an interface for users. It uses `fetch()` to communicate with the API and `Chart.js` to render visual insights.

## Deployment View
```text
[ Dataset ] -> [ Training Script ] -> [ model.pkl ]
                                           |
[ User ] <-> [ Dashboard (JS) ] <-> [ Flask API ]
```
