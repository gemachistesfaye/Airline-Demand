# 10 Frontend

## Design Philosophy
The **AeroDemand AI** interface is designed to be a "Professional Analytics Dashboard." It moves away from standard project layouts to provide a sleek, SaaS-like experience.

## Tech Stack
- **Framework**: Vanilla JavaScript (SPA architecture).
- **Styling**: Tailwind CSS (modern utility-first design).
- **Icons**: FontAwesome 6.4.
- **Charts**: Chart.js for interactive time-series visualization.
- **Typography**: Inter (Google Fonts).

## Main Components

### 1. Dashboard Overview
- **Metric Cards**: Displaying Avg. Passengers, Model Accuracy (R²), and Last Data Point.
- **Mini Trend Chart**: A quick visual of the last 24 months of demand.

### 2. Predictive Engine
- **Input Form**: Clean, rounded fields for Year, Month and Price.
- **Smart Features**: Automatic season detection based on the selected month.
- **Feedback System**: Professional loading spinners and detailed result cards.

### 3. Advanced Analytics
- **Full Trend View**: A zoomable chart of the entire 144-month history.
- **Seasonal Bar Chart**: Aggregated demand by season to show cyclical patterns.
- **Confidence Metrics**: Visual bars showing Trend Capture and Variance Handling.

## User Experience (UX)
- **Zero Reloads**: All page transitions and API calls happen asynchronously using the Fetch API.
- **Responsive Layout**: Sidebar-based navigation that adapts to different screen sizes.
- **Color System**: A minimal palette of Deep Navy (#0f172a) and Accent Blue (#3b82f6).
