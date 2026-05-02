const API_BASE = 'http://127.0.0.1:5000';

// Chart instances
let historicalChart, trendChart, seasonalChart;
let lastPredictions = [];

document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

async function init() {
    await fetchMetrics();
    await fetchHistoricalData();
    await fetchDecomposition();
    // Removed runPrediction() from init to keep result hidden initially
}

function setupEventListeners() {
    // Prediction triggers on submit
    document.getElementById('prediction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        runPrediction();
    });

    // Label update for price slider
    document.getElementById('price').addEventListener('input', (e) => {
        document.getElementById('price-val').innerText = e.target.value;
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
        document.body.classList.toggle('dark', e.target.checked);
        updateChartThemes(e.target.checked);
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', handleExport);
}

async function runPrediction() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const price = document.getElementById('price').value;

    try {
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, month, price })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            const resultDiv = document.getElementById('result');
            const valDiv = document.getElementById('prediction-val');
            
            // Show the result section if it was hidden
            resultDiv.style.display = 'block';
            
            animateValue(valDiv, parseInt(valDiv.innerText.replace(/,/g, '')) || 0, Math.round(data.prediction), 500);
            
            // Store for export
            lastPredictions.push({
                Year: year,
                Month: month,
                Price: price,
                Predicted_Passengers: Math.round(data.prediction)
            });
            if (lastPredictions.length > 50) lastPredictions.shift();
        }
    } catch (err) {
        console.error('Prediction error:', err);
    }
}

async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();
        document.getElementById('r2-val').innerText = data.r2.toFixed(4);
        document.getElementById('mae-val').innerText = data.mae.toFixed(2);
        document.getElementById('rmse-val').innerText = data.rmse.toFixed(2);
    } catch (err) {}
}

async function fetchHistoricalData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        const data = await response.json();
        renderHistoricalChart(data);
    } catch (err) {}
}

async function fetchDecomposition() {
    try {
        const response = await fetch(`${API_BASE}/decompose`);
        const data = await response.json();
        renderDecompositionCharts(data);
    } catch (err) {}
}

function renderHistoricalChart(data) {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    const labels = data.map(item => item.Month);
    const values = data.map(item => item['#Passengers']);

    historicalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Historical Demand',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: getChartOptions('Demand over Time')
    });
}

function renderDecompositionCharts(data) {
    // Trend Chart
    const tCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(tCtx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Underlying Trend',
                data: data.trend,
                borderColor: '#ec4899',
                borderWidth: 2,
                pointRadius: 0,
                fill: false
            }]
        },
        options: getChartOptions('Trend Component (Long-term growth)')
    });

    // Seasonal Chart
    const sCtx = document.getElementById('seasonalChart').getContext('2d');
    seasonalChart = new Chart(sCtx, {
        type: 'line',
        data: {
            labels: data.labels.slice(0, 24), // Show 2 years of cycles
            datasets: [{
                label: 'Seasonal Cycle',
                data: data.seasonal.slice(0, 24),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                pointRadius: 0
            }]
        },
        options: getChartOptions('Seasonal Component (Yearly cycle)')
    });
}

async function handleExport() {
    if (lastPredictions.length === 0) {
        alert('Make some predictions first!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/export`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ predictions: lastPredictions })
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Forecast_Report.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (err) {
        alert('Export failed');
    }
}

function getChartOptions(title) {
    const isDark = document.body.classList.contains('dark');
    const color = isDark ? '#94a3b8' : '#6b7280';
    const gridColor = isDark ? '#334155' : '#f3f4f6';

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, color: color }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: color, maxTicksLimit: 10 }
            },
            y: {
                grid: { color: gridColor },
                ticks: { color: color }
            }
        }
    };
}

function updateChartThemes(isDark) {
    [historicalChart, trendChart, seasonalChart].forEach(chart => {
        if (!chart) return;
        const color = isDark ? '#94a3b8' : '#6b7280';
        const gridColor = isDark ? '#334155' : '#f3f4f6';
        
        chart.options.plugins.title.color = color;
        chart.options.scales.x.ticks.color = color;
        chart.options.scales.y.ticks.color = color;
        chart.options.scales.y.grid.color = gridColor;
        chart.update();
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
