document.addEventListener('DOMContentLoaded', async () => {
    // Initial fetch
    await Promise.all([
        fetchMetrics(),
        fetchChartData()
    ]);
});

async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();
        
        // Display metrics with professional formatting
        document.getElementById('r2-val').innerText = (data.r2 * 100).toFixed(1) + '%';
        document.getElementById('mae-val').innerText = data.mae.toFixed(2);
        document.getElementById('rmse-val').innerText = data.rmse.toFixed(2);
    } catch (err) {
        console.error('Metrics retrieval failed:', err);
    }
}

async function fetchChartData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        const data = await response.json();
        
        renderTimelineChart(data);
        renderSeasonalChart(data);
    } catch (err) {
        console.error('Dataset retrieval failed:', err);
    }
}

function renderTimelineChart(data) {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    
    const labels = data.map(item => item.Month);
    const values = data.map(item => item['#Passengers']);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Passenger Count',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0f172a',
                    titleFont: { size: 13 },
                    bodyFont: { size: 13 },
                    padding: 10
                }
            },
            scales: {
                x: { 
                    grid: { display: false },
                    ticks: { maxTicksLimit: 12, color: '#64748b' } 
                },
                y: { 
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#64748b' } 
                }
            }
        }
    });
}

function renderSeasonalChart(data) {
    const ctx = document.getElementById('seasonalChart').getContext('2d');
    
    // Calculate monthly averages
    const monthlyData = {};
    data.forEach(item => {
        const monthNum = item.Month.split('-')[1];
        if (!monthlyData[monthNum]) monthlyData[monthNum] = [];
        monthlyData[monthNum].push(item['#Passengers']);
    });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const averages = [];
    for (let i = 1; i <= 12; i++) {
        const key = i.toString().padStart(2, '0');
        const avg = monthlyData[key].reduce((a, b) => a + b, 0) / monthlyData[key].length;
        averages.push(avg);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Mean Demand',
                data: averages,
                backgroundColor: '#334155',
                hoverBackgroundColor: '#2563eb',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: { backgroundColor: '#0f172a' }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b' } },
                y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } }
            }
        }
    });
}
