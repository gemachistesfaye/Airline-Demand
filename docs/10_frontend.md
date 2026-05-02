# 10 Frontend

## Design Philosophy
The frontend was designed with a focus on **clarity**, **simplicity**, and **clean aesthetics**. It uses a professional white-themed UI with soft shadows and a centered layout to ensure the focus remains on the data and predictions.

## Technology Stack
- **HTML5**: Semantic structure.
- **CSS3**: Custom styling with a modern "Inter" typography and responsive grid layout.
- **JavaScript (Vanilla)**: All logic is written in plain ES6+ JavaScript, avoiding the overhead of heavy frameworks like React or Vue.
- **Chart.js**: A high-performance charting library used for the historical demand line graph.

## Main Components
1. **Prediction Form**: Allows users to select Year, Month, and Price.
2. **Dynamic Result Display**: Shows the predicted passenger count immediately after calculation.
3. **Historical Trend Chart**: Interactive graph showing the growth of demand over time.
4. **Model Metrics Panel**: Displays real-time model accuracy scores directly from the backend.

## User Experience (UX)
- **Responsive**: The dashboard adjusts seamlessly to mobile, tablet, and desktop screens.
- **Immediate Feedback**: Form submission uses asynchronous `fetch` to update the results without page reloads.
