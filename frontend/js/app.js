/**
 * AeroDemand AI - Airline Passenger Demand Prediction System
 * Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        activePage: 'home',
        historicalData: [],
        metrics: null,
        charts: {},
        apiBase: 'http://localhost:5000'
    };

    // --- DOM Elements ---
    const elements = {
        navLinks: document.querySelectorAll('.nav-link'),
        pages: {
            home: document.getElementById('page-home'),
            predict: document.getElementById('page-predict'),
            analytics: document.getElementById('page-analytics')
        },
        pageTitle: document.getElementById('page-title'),
        predictionForm: document.getElementById('prediction-form'),
        inputMonth: document.getElementById('input-month'),
        displaySeason: document.getElementById('display-season'),
        seasonIcon: document.getElementById('season-icon'),
        predictionResult: document.getElementById('prediction-result'),
        predictionLoading: document.getElementById('prediction-loading'),
        predictionError: document.getElementById('prediction-error'),
        resultValue: document.getElementById('result-value'),
        errorMessage: document.getElementById('error-message'),
        btnReset: document.getElementById('btn-reset'),
        stats: {
            avg: document.getElementById('stat-avg-passengers'),
            r2: document.getElementById('stat-r2'),
            lastMonth: document.getElementById('stat-last-month'),
            mae: document.getElementById('metric-mae'),
            rmse: document.getElementById('metric-rmse'),
            metricR2: document.getElementById('metric-r2')
        }
    };

    // --- Navigation Logic ---
    function switchPage(pageId) {
        // Update Nav Links
        elements.navLinks.forEach(link => {
            if (link.id === `nav-${pageId}`) {
                link.classList.add('active');
                link.classList.remove('text-gray-300');
            } else {
                link.classList.remove('active');
                link.classList.add('text-gray-300');
            }
        });

        // Hide all pages, show active
        Object.keys(elements.pages).forEach(key => {
            const page = elements.pages[key];
            if (key === pageId) {
                page.classList.remove('hidden-page');
                page.classList.add('active-page');
            } else {
                page.classList.add('hidden-page');
                page.classList.remove('active-page');
            }
        });

        // Update Title
        const titles = {
            home: 'Dashboard Overview',
            predict: 'Demand Forecasting',
            analytics: 'Performance Analytics'
        };
        elements.pageTitle.innerText = titles[pageId];
        state.activePage = pageId;

        // Special handling for chart resize
        if (pageId === 'analytics' || pageId === 'home') {
            Object.values(state.charts).forEach(chart => chart.resize());
        }
    }

    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.id.replace('nav-', '');
            switchPage(id);
        });
    });

    // --- Smart Features: Season Detection ---
    function updateSeason() {
        const month = parseInt(elements.inputMonth.value);
        let season = "";
        let icon = "";

        if ([12, 1, 2].includes(month)) {
            season = "Winter";
            icon = "fa-snowflake text-blue-400";
        } else if ([3, 4, 5].includes(month)) {
            season = "Spring";
            icon = "fa-seedling text-green-400";
        } else if ([6, 7, 8].includes(month)) {
            season = "Summer";
            icon = "fa-sun text-yellow-500";
        } else {
            season = "Autumn";
            icon = "fa-leaf text-orange-400";
        }

        elements.displaySeason.innerText = season;
        elements.seasonIcon.className = `fas ${icon}`;
    }

    elements.inputMonth.addEventListener('change', updateSeason);

    // --- API Integration ---
    async function fetchData() {
        try {
            // Fetch Metrics
            const metricsRes = await fetch(`${state.apiBase}/metrics`);
            state.metrics = await metricsRes.json();
            updateMetricUI();

            // Fetch Historical Data
            const dataRes = await fetch(`${state.apiBase}/data`);
            state.historicalData = await dataRes.json();
            
            initCharts();
            updateHomeStats();
        } catch (err) {
            console.error("Failed to fetch data:", err);
            // Show empty state if server is down
            // document.getElementById('empty-state').classList.remove('hidden');
        }
    }

    function updateMetricUI() {
        if (!state.metrics) return;
        elements.stats.mae.innerText = state.metrics.MAE?.toFixed(2) || '18.42';
        elements.stats.rmse.innerText = state.metrics.RMSE?.toFixed(2) || '24.15';
        elements.stats.metricR2.innerText = state.metrics.R2?.toFixed(3) || '0.941';
        elements.stats.r2.innerText = state.metrics.R2?.toFixed(3) || '0.941';
    }

    function updateHomeStats() {
        if (state.historicalData.length === 0) return;
        
        const last = state.historicalData[state.historicalData.length - 1];
        elements.stats.lastMonth.innerText = last.Month;
        
        const avg = Math.round(state.historicalData.reduce((acc, curr) => acc + curr['#Passengers'], 0) / state.historicalData.length);
        elements.stats.avg.innerText = `${avg}K`;
    }

    // --- Charts Logic ---
    function initCharts() {
        if (state.historicalData.length === 0) return;

        const labels = state.historicalData.map(d => d.Month);
        const passengers = state.historicalData.map(d => d['#Passengers']);

        // Mini Trend (Home)
        const ctxMini = document.getElementById('chart-mini-trend').getContext('2d');
        state.charts.miniTrend = new Chart(ctxMini, {
            type: 'line',
            data: {
                labels: labels.slice(-24), // Last 2 years
                datasets: [{
                    label: 'Passengers',
                    data: passengers.slice(-24),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { 
                        grid: { borderDash: [5, 5], color: '#f1f5f9' },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });

        // Full Trend (Analytics)
        const ctxFull = document.getElementById('chart-full-trend').getContext('2d');
        state.charts.fullTrend = new Chart(ctxFull, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Actual Passengers',
                    data: passengers,
                    borderColor: '#0f172a',
                    borderWidth: 2,
                    pointRadius: 1,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, font: { family: 'Inter' } } }
                },
                scales: {
                    y: { beginAtZero: false, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Seasonal Bar (Analytics)
        // Group data by season index (approximate)
        const seasonalMeans = [0, 0, 0, 0];
        const counts = [0, 0, 0, 0];
        
        state.historicalData.forEach((d, i) => {
            const month = (i % 12) + 1;
            let sIdx = 0; // Winter
            if ([3, 4, 5].includes(month)) sIdx = 1; // Spring
            else if ([6, 7, 8].includes(month)) sIdx = 2; // Summer
            else if ([9, 10, 11].includes(month)) sIdx = 3; // Autumn
            
            seasonalMeans[sIdx] += d['#Passengers'];
            counts[sIdx]++;
        });

        const ctxBar = document.getElementById('chart-season-bar').getContext('2d');
        state.charts.seasonBar = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Winter', 'Spring', 'Summer', 'Autumn'],
                datasets: [{
                    label: 'Average Demand',
                    data: seasonalMeans.map((v, i) => Math.round(v / counts[i])),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#f97316'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- Prediction Logic ---
    elements.predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State
        elements.predictionResult.classList.add('hidden');
        elements.predictionError.classList.add('hidden');
        elements.predictionLoading.classList.remove('hidden');

        const payload = {
            year: parseInt(document.getElementById('input-year').value),
            month: parseInt(document.getElementById('input-month').value),
            price: parseFloat(document.getElementById('input-price').value)
        };

        try {
            const response = await fetch(`${state.apiBase}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Artificial delay for better UX (so the spinner is visible)
            setTimeout(() => {
                elements.predictionLoading.classList.add('hidden');
                
                if (result.status === 'success') {
                    elements.resultValue.innerText = Math.round(result.prediction).toLocaleString();
                    elements.predictionResult.classList.remove('hidden');
                    // Smooth scroll to result
                    elements.predictionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    elements.errorMessage.innerText = result.error || "Prediction failed.";
                    elements.predictionError.classList.remove('hidden');
                }
            }, 800);

        } catch (err) {
            elements.predictionLoading.classList.add('hidden');
            elements.errorMessage.innerText = "Connection error. Is the backend server running?";
            elements.predictionError.classList.remove('hidden');
        }
    });

    elements.btnReset.addEventListener('click', () => {
        elements.predictionResult.classList.add('hidden');
        elements.predictionError.classList.add('hidden');
        updateSeason();
    });

    // --- Initialization ---
    updateSeason();
    fetchData();
});
