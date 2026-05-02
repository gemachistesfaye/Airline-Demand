const API_URL = 'http://127.0.0.1:5000';
console.log("Airline Prediction Script Loaded");
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
    console.log("Fetching initial data...");
    try {
        const response = await fetch(`${API_URL}/data`);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        // Safety Try/Catch for JSON parsing
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error("Malformed JSON received:", jsonError);
            return;
        }
        
        // Robust data validation
        if (result && Array.isArray(result.data) && result.data.length > 0) {
            renderChart(result.data);
            
            // Check if metrics exist and are valid numbers
            const r2Element = document.getElementById('r2-score');
            if (result.metrics && typeof result.metrics.r2 === 'number') {
                r2Element.innerText = result.metrics.r2;
            } else {
                r2Element.innerText = "N/A";
            }
        } else {
            console.warn("No data available for chart rendering.");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        // Error display without blocking the main thread
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

        // Safety Try/Catch for JSON parsing
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON response from server");
        }

        if (result && result.prediction !== undefined) {
            valueDisplay.innerText = `${Math.round(result.prediction)} Passengers`;
            valueDisplay.style.color = "var(--primary-color)";
            resultBox.classList.remove('hidden');
        } else {
            throw new Error("Missing prediction data in response");
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
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("Cannot render chart: Data is empty or invalid.");
        return;
    }

    const ctx = document.getElementById('demandChart').getContext('2d');
    
    const labels = data.map(row => row.Month || "Unknown");
    const actualData = data.map(row => row.Passengers || 0);
    const predictedData = data.map(row => row.Predicted || 0);

    // Final safety check for empty arrays
    if (labels.length === 0 || actualData.length === 0) {
        console.warn("Skipping chart render: Processed arrays are empty.");
        return;
    }

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
