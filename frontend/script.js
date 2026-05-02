const API_BASE = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {
    fetchMetrics();
    fetchHistoricalData();

    document.getElementById('prediction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
                
                resultDiv.style.display = 'block';
                valDiv.innerText = Math.round(data.prediction).toLocaleString();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to backend.');
        }
    });
});

async function fetchMetrics() {
    try {
        const response = await fetch(`${API_BASE}/metrics`);
        const data = await response.json();
        
        document.getElementById('r2-val').innerText = data.r2.toFixed(4);
        document.getElementById('mae-val').innerText = data.mae.toFixed(2);
        document.getElementById('rmse-val').innerText = data.rmse.toFixed(2);
    } catch (err) {
        console.error('Metrics fetch error:', err);
    }
}

async function fetchHistoricalData() {
    try {
        const response = await fetch(`${API_BASE}/data`);
        const data = await response.json();
        
        renderChart(data);
    } catch (err) {
        console.error('Data fetch error:', err);
    }
}

function renderChart(data) {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    
    const labels = data.map(item => item.Month);
    const values = data.map(item => item['#Passengers']);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Historical Passengers',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { maxTicksLimit: 12 }
                },
                y: {
                    beginAtZero: false,
                    grid: { color: '#f3f4f6' }
                }
            }
        }
    });
}
