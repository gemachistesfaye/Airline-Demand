document.addEventListener('DOMContentLoaded', async () => {
    await fetchMetrics();
    await fetchChartData();
});

async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();
        
        document.getElementById('r2-val').innerText = (data.r2 * 100).toFixed(1) + '%';
        document.getElementById('mae-val').innerText = data.mae.toFixed(2);
        document.getElementById('rmse-val').innerText = data.rmse.toFixed(2);
    } catch (err) {
        console.error('Metrics fetch error:', err);
    }
}

async function fetchChartData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        const data = await response.json();
        
        renderHistoricalChart(data);
        renderSeasonalChart(data);
    } catch (err) {
        console.error('Data fetch error:', err);
    }
}

function renderHistoricalChart(data) {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    
    const labels = data.map(item => item.Month);
    const values = data.map(item => item['#Passengers']);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Passengers',
                data: values,
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { maxTicksLimit: 12 } },
                y: { grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        }
    });
}

function renderSeasonalChart(data) {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    
    // Group by month
    const monthlyData = {};
    data.forEach(item => {
        const month = item.Month.split('-')[1];
        if (!monthlyData[month]) monthlyData[month] = [];
        monthlyData[month].push(item['#Passengers']);
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const avgValues = [];
    for (let i = 1; i <= 12; i++) {
        const m = i.toString().padStart(2, '0');
        const avg = monthlyData[m].reduce((a, b) => a + b, 0) / monthlyData[m].length;
        avgValues.push(avg);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Avg Demand',
                data: avgValues,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}
