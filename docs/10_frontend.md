# 10 Frontend

## Design Philosophy (Pro V2.0)
The AeroDemand AI Pro interface is built to handle multiple data streams without overwhelming the user. It uses a **modular grid system** and **dynamic theming** to create a high-end dashboard feel.

## Pro Components

### 1. The "What-If" Slider
- **Logic**: Connected to the `price` input. Moving the slider triggers a debounced API call to the `/predict` endpoint.
- **Impact**: Allows users to visually see the elasticity of demand relative to price.

### 2. Dual-Theme Engine (Dark Mode)
- **Implementation**: Uses CSS custom variables (`:root` and `body.dark`) to switch the entire UI's color palette.
- **Chart Sync**: JavaScript logic ensures that Chart.js gridlines and labels also update their colors when the theme changes.

### 3. Multi-Chart Dashboard
- **Historical Chart**: Overview of demand.
- **Trend Chart**: Shows the "smoothed" growth curve.
- **Seasonal Chart**: Shows the recurring 12-month pattern (peaks in July/August).

### 4. Export Integration
- **Feature**: Collects the user's latest prediction history and sends it to the backend for Excel conversion.

## User Experience (UX)
- **Live Updating**: Numerical values use a count-up animation for a more dynamic "high-tech" feel.
- **Responsive Design**: The dashboard automatically switches from a two-column layout to a single column on smaller screens.
