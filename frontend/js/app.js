/**
 * AeroDemand AI — Airline Passenger Demand Prediction System
 * Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── State ──────────────────────────────────────────────────────────────────
    const state = {
        activePage:     'home',
        historicalData: [],
        metrics:        null,
        charts:         {},
        apiBase:        'http://localhost:5000'
    };

    // ── DOM Elements ───────────────────────────────────────────────────────────
    const el = {
        navLinks:          document.querySelectorAll('.nav-link'),
        pages: {
            home:      document.getElementById('page-home'),
            predict:   document.getElementById('page-predict'),
            analytics: document.getElementById('page-analytics')
        },
        pageTitle:         document.getElementById('page-title'),
        predictionForm:    document.getElementById('prediction-form'),
        inputYear:         document.getElementById('input-year'),
        inputMonth:        document.getElementById('input-month'),
        displaySeason:     document.getElementById('display-season'),
        seasonIcon:        document.getElementById('season-icon'),
        predictionResult:  document.getElementById('prediction-result'),
        predictionLoading: document.getElementById('prediction-loading'),
        predictionError:   document.getElementById('prediction-error'),
        resultValue:       document.getElementById('result-value'),
        errorMessage:      document.getElementById('error-message'),
        btnReset:          document.getElementById('btn-reset'),
        stats: {
            avg:      document.getElementById('stat-avg-passengers'),
            r2:       document.getElementById('stat-r2'),
            lastMonth:document.getElementById('stat-last-month'),
            mae:      document.getElementById('metric-mae'),
            rmse:     document.getElementById('metric-rmse'),
            metricR2: document.getElementById('metric-r2')
        }
    };

    // ── Navigation ─────────────────────────────────────────────────────────────
    const pageTitles = {
        home:      'Dashboard Overview',
        predict:   'Demand Forecasting',
        analytics: 'Performance Analytics'
    };

    function switchPage(pageId) {
        el.navLinks.forEach(link => {
            const isActive = link.id === `nav-${pageId}`;
            link.classList.toggle('active', isActive);
            link.classList.toggle('text-gray-300', !isActive);
        });

        Object.entries(el.pages).forEach(([key, page]) => {
            const isActive = key === pageId;
            page.classList.toggle('hidden-page', !isActive);
            page.classList.toggle('active-page', isActive);
        });

        el.pageTitle.innerText = pageTitles[pageId] || '';
        state.activePage = pageId;

        // Resize charts when switching to a page that has them
        if (pageId === 'analytics' || pageId === 'home') {
            Object.values(state.charts).forEach(chart => chart.resize());
        }
    }

    el.navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchPage(link.id.replace('nav-', ''));
        });
    });

    // ── Season Detection ───────────────────────────────────────────────────────
    const seasonConfig = {
        Winter: { months: [12, 1, 2],  icon: 'fa-snowflake text-blue-400'  },
        Spring: { months: [3,  4, 5],  icon: 'fa-seedling text-green-400'  },
        Summer: { months: [6,  7, 8],  icon: 'fa-sun text-yellow-500'      },
        Autumn: { months: [9, 10, 11], icon: 'fa-leaf text-orange-400'     }
    };

    function getSeasonName(month) {
        for (const [name, cfg] of Object.entries(seasonConfig)) {
            if (cfg.months.includes(month)) return name;
        }
        return 'Winter';
    }

    function updateSeasonDisplay(month) {
        const name = getSeasonName(month);
        const cfg  = seasonConfig[name];
        el.displaySeason.innerText  = name;
        el.seasonIcon.className     = `fas ${cfg.icon}`;
    }

    el.inputMonth.addEventListener('change', () => {
        updateSeasonDisplay(parseInt(el.inputMonth.value));
    });

    // ── Input Validation ───────────────────────────────────────────────────────
    function validateInputs(year, month) {
        if (isNaN(year) || year < 1949 || year > 2030) {
            showError('Year must be between 1949 and 2030.');
            return false;
        }
        if (isNaN(month) || month < 1 || month > 12) {
            showError('Please select a valid month.');
            return false;
        }
        return true;
    }

    // ── API Calls ──────────────────────────────────────────────────────────────
    async function fetchMetrics() {
        const res  = await fetch(`${state.apiBase}/metrics`);
        state.metrics = await res.json();
        updateMetricUI();
    }

    async function fetchHistoricalData() {
        const res = await fetch(`${state.apiBase}/data`);
        state.historicalData = await res.json();
        updateHomeStats();
        initCharts();
    }

    async function fetchAllData() {
        try {
            await Promise.all([fetchMetrics(), fetchHistoricalData()]);
        } catch (err) {
            console.error('Could not reach backend:', err);
        }
    }

    // ── Metric UI ──────────────────────────────────────────────────────────────
    function updateMetricUI() {
        if (!state.metrics) return;

        // Keys now match app.py: lowercase mae / rmse / r2
        const mae  = state.metrics.mae;
        const rmse = state.metrics.rmse;
        const r2   = state.metrics.r2;

        if (el.stats.mae)      el.stats.mae.innerText      = mae  != null ? mae.toFixed(2)  : '—';
        if (el.stats.rmse)     el.stats.rmse.innerText     = rmse != null ? rmse.toFixed(2) : '—';
        if (el.stats.metricR2) el.stats.metricR2.innerText = r2   != null ? r2.toFixed(3)   : '—';

        // CV metrics (new elements in updated index.html)
        const cvR2   = document.getElementById('cv-r2-mean');
        const cvMae  = document.getElementById('cv-mae-mean');
        const cvRmse = document.getElementById('cv-rmse-mean');
        const status = document.getElementById('status-text');

        if (cvR2)   cvR2.innerText   = state.metrics.cv_r2_mean   != null ? state.metrics.cv_r2_mean.toFixed(3)   : '—';
        if (cvMae)  cvMae.innerText  = state.metrics.cv_mae_mean  != null ? state.metrics.cv_mae_mean.toFixed(2)  : '—';
        if (cvRmse) cvRmse.innerText = state.metrics.cv_rmse_mean != null ? state.metrics.cv_rmse_mean.toFixed(2) : '—';
        if (status) status.innerText = 'Model Ready';
        if (el.stats.r2)       el.stats.r2.innerText       = r2   != null ? r2.toFixed(3)   : '—';
    }

    // ── Home Stats ─────────────────────────────────────────────────────────────
    function updateHomeStats() {
        if (!state.historicalData.length) return;

        const last = state.historicalData[state.historicalData.length - 1];

        // Column name is now 'Passengers' (renamed in train.py / app.py)
        const passengers = state.historicalData.map(d => d.Passengers);
        const avg = Math.round(passengers.reduce((a, b) => a + b, 0) / passengers.length);

        if (el.stats.avg)       el.stats.avg.innerText      = avg.toLocaleString();
        if (el.stats.lastMonth) el.stats.lastMonth.innerText = last.Month || '—';
    }

    // ── Charts ─────────────────────────────────────────────────────────────────
    function destroyChart(key) {
        if (state.charts[key]) {
            state.charts[key].destroy();
            delete state.charts[key];
        }
    }

    function initCharts() {
        if (!state.historicalData.length) return;

        const labels     = state.historicalData.map(d => d.Month);
        // Column name is now 'Passengers'
        const passengers = state.historicalData.map(d => d.Passengers);

        // ── Mini trend (Dashboard) ─────────────────────────────────────────────
        destroyChart('miniTrend');
        const ctxMini = document.getElementById('chart-mini-trend').getContext('2d');
        state.charts.miniTrend = new Chart(ctxMini, {
            type: 'line',
            data: {
                labels:   labels.slice(-24),
                datasets: [{
                    label:           'Passengers',
                    data:            passengers.slice(-24),
                    borderColor:     '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    fill:            true,
                    tension:         0.4,
                    borderWidth:     3,
                    pointRadius:     0,
                    pointHoverRadius:6
                }]
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: {
                        grid:  { color: '#f1f5f9' },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });

        // ── Full trend (Analytics) ─────────────────────────────────────────────
        destroyChart('fullTrend');
        const ctxFull = document.getElementById('chart-full-trend').getContext('2d');
        state.charts.fullTrend = new Chart(ctxFull, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label:       'Actual Passengers',
                    data:        passengers,
                    borderColor: '#0f172a',
                    borderWidth: 2,
                    pointRadius: 1,
                    tension:     0.1
                }]
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction:         { intersect: false, mode: 'index' },
                plugins: {
                    legend: {
                        position: 'top',
                        labels:   { usePointStyle: true }
                    }
                },
                scales: {
                    y: { beginAtZero: false, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                }
            }
        });

        // ── Seasonal bar (Analytics) ───────────────────────────────────────────
        destroyChart('seasonBar');

        // Correctly derive month from the Month string (e.g. "1949-01")
        const seasonTotals = { Winter: 0, Spring: 0, Summer: 0, Autumn: 0 };
        const seasonCounts = { Winter: 0, Spring: 0, Summer: 0, Autumn: 0 };

        state.historicalData.forEach(d => {
            const month  = new Date(d.Month).getMonth() + 1; // 1-12
            const season = getSeasonName(month);
            seasonTotals[season] += d.Passengers;
            seasonCounts[season]++;
        });

        const seasonLabels = ['Winter', 'Spring', 'Summer', 'Autumn'];
        const seasonAvgs   = seasonLabels.map(s =>
            seasonCounts[s] > 0 ? Math.round(seasonTotals[s] / seasonCounts[s]) : 0
        );

        const ctxBar = document.getElementById('chart-season-bar').getContext('2d');
        state.charts.seasonBar = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels:   seasonLabels,
                datasets: [{
                    label:           'Avg Passengers',
                    data:            seasonAvgs,
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#f97316'],
                    borderRadius:    8
                }]
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // ── Prediction ─────────────────────────────────────────────────────────────
    function showLoading() {
        el.predictionResult.classList.add('hidden');
        el.predictionError.classList.add('hidden');
        el.predictionLoading.classList.remove('hidden');
    }

    function showError(msg) {
        el.predictionLoading.classList.add('hidden');
        el.predictionResult.classList.add('hidden');
        el.errorMessage.innerText = msg;
        el.predictionError.classList.remove('hidden');
    }

    function showResult(value) {
        el.predictionLoading.classList.add('hidden');
        el.predictionError.classList.add('hidden');
        el.resultValue.innerText = Math.round(value).toLocaleString();
        el.predictionResult.classList.remove('hidden');
        el.predictionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    el.predictionForm.addEventListener('submit', async e => {
        e.preventDefault();

        const year  = parseInt(el.inputYear.value);
        const month = parseInt(el.inputMonth.value);

        // Client-side validation before hitting the API
        if (!validateInputs(year, month)) return;

        showLoading();

        // Price field removed — backend no longer uses it
        const payload = { year, month };

        try {
            const response = await fetch(`${state.apiBase}/predict`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload)
            });

            const result = await response.json();

            // Small delay so the spinner is visible
            setTimeout(() => {
                if (result.status === 'success') {
                    // Update season display from server response (authoritative)
                    if (result.season) updateSeasonDisplay(month);
                    showResult(result.prediction);
                } else {
                    showError(result.error || 'Prediction failed.');
                }
            }, 600);

        } catch (err) {
            showError('Connection error. Is the backend server running on port 5000?');
        }
    });

    el.btnReset.addEventListener('click', () => {
        el.predictionResult.classList.add('hidden');
        el.predictionError.classList.add('hidden');
        updateSeasonDisplay(parseInt(el.inputMonth.value));
    });

    // ── Init ───────────────────────────────────────────────────────────────────
    updateSeasonDisplay(parseInt(el.inputMonth.value));
    fetchAllData();
});
