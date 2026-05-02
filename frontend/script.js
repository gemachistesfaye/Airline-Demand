const API_URL = 'http://127.0.0.1:5000';
let demandChart;

document.addEventListener('DOMContentLoaded', () => {
    // Initial data load
    fetchData();

    // Handle form submission
    const form = document.getElementById('prediction-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload
            e.stopPropagation();
            console.log("Form submission intercepted");
            handlePredict();
            return false;
        });
    }
});

async function fetchData() {
    showLoader(true);
    try {
        const response = await fetch(`${API_URL}/data`);
        const result = await response.json();
        
        if (result.data) {
            renderChart(result.data);
            document.getElementById('r2-score').innerText = result.metrics.r2;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Could not connect to the backend API. Make sure it is running.');
    } finally {
        showLoader(false);
    }
}

async function handlePredict() {
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;

    if (!year) {
        alert("Please enter a year");
        return;
    }

    showLoader(true);
    const resultBox = document.getElementById('result-container');
    const valueDisplay = document.getElementById('prediction-value');

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ month: parseInt(month), year: parseInt(year) }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.prediction !== undefined) {
            valueDisplay.innerText = `${Math.round(result.prediction)} Passengers`;
            valueDisplay.style.color = "var(--primary-color)";
            resultBox.classList.remove('hidden');
        } else {
            throw new Error("Invalid response from server");
        }
    } catch (error) {
        console.error('Error predicting:', error);
        valueDisplay.innerText = "Error: Backend unreachable";
        valueDisplay.style.color = "red";
        resultBox.classList.remove('hidden');
    } finally {
        showLoader(false);
    }
}

function renderChart(data) {
    const ctx = document.getElementById('demandChart').getContext('2d');
    
    const labels = data.map(row => row.Month);
    const actualData = data.map(row => row.Passengers);
    const predictedData = data.map(row => row.Predicted);

    if (demandChart) {
        demandChart.destroy();
    }

    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Actual Passengers',
                    data: actualData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Predicted (Model)',
                    data: predictedData,
                    borderColor: '#ef4444',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Passenger Count'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}
