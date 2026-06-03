import re
import os

html_path = r'e:\GitHub Repo\Airline-Demand\frontend\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. Background decorations
html_content = html_content.replace(
    '<body class="bg-slate-50">\n\n    <div class="flex h-screen overflow-hidden">',
    '''<body class="bg-slate-50 relative overflow-hidden">
    <!-- Decorative background elements for glassmorphism -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
    </div>

    <div class="flex h-screen w-full overflow-hidden bg-slate-50/50 backdrop-blur-sm">'''
)

# 2. Export button
html_content = html_content.replace(
    '''<div class="p-8 border-b border-gray-100">
                                <h3 class="text-xl font-bold text-navy-900">Demand Forecaster</h3>
                                <p class="text-gray-500 text-sm mt-1">
                                    Select a year and month to predict passenger volume.
                                </p>
                            </div>''',
    '''<div class="p-8 border-b border-gray-100/50 flex justify-between items-center">
                                <div>
                                    <h3 class="text-xl font-bold text-navy-900">Demand Forecaster</h3>
                                    <p class="text-gray-500 text-sm mt-1">
                                        Select a year and month to predict passenger volume.
                                    </p>
                                </div>
                                <button id="btn-export" class="hidden px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all shadow-sm">
                                    <i class="fas fa-file-excel mr-2"></i> Export .xlsx
                                </button>
                            </div>'''
)

# 3. Mobile Navigation & Footer
html_content = html_content.replace(
    '''            <!-- Footer -->
            <footer class="h-10 bg-white border-t border-gray-100 flex items-center justify-between px-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <span>AeroDemand AI v1.0.4</span>
                <span>© 2026 University Academic Project</span>
            </footer>
        </main>
    </div>''',
    '''            <!-- Footer -->
            <footer class="h-10 glass border-t border-white/50 flex items-center justify-between px-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold hidden md:flex">
                <span>AeroDemand AI v1.0.4</span>
                <span>© 2026 University Academic Project</span>
            </footer>

            <!-- Mobile Bottom Navigation -->
            <nav class="md:hidden glass border-t border-white/50 flex justify-around items-center h-16 w-full shrink-0 z-50">
                <a href="#" id="nav-mobile-home" class="nav-link active flex flex-col items-center w-full text-navy-900 transition-colors py-2">
                    <i class="fas fa-th-large text-lg mb-1"></i>
                    <span class="text-[10px] uppercase font-bold">Dashboard</span>
                </a>
                <a href="#" id="nav-mobile-predict" class="nav-link flex flex-col items-center w-full text-gray-400 transition-colors py-2">
                    <i class="fas fa-chart-line text-lg mb-1"></i>
                    <span class="text-[10px] uppercase font-bold">Predict</span>
                </a>
                <a href="#" id="nav-mobile-analytics" class="nav-link flex flex-col items-center w-full text-gray-400 transition-colors py-2">
                    <i class="fas fa-pie-chart text-lg mb-1"></i>
                    <span class="text-[10px] uppercase font-bold">Analytics</span>
                </a>
            </nav>
        </main>
    </div>'''
)

# 4. Glassmorphism replacements
html_content = html_content.replace('bg-white', 'glass')
html_content = html_content.replace('border-gray-100', 'border-white/50')
html_content = html_content.replace('border-gray-200', 'border-white/50')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Updated index.html")

# Update js/app.js
js_path = r'e:\GitHub Repo\Airline-Demand\frontend\js\app.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add lastPredictions to state
js_content = js_content.replace(
    '''    const state = {
        activePage:     'home',
        historicalData: [],
        metrics:        null,
        charts:         {},
        apiBase:        ''
    };''',
    '''    const state = {
        activePage:     'home',
        historicalData: [],
        metrics:        null,
        charts:         {},
        apiBase:        '',
        lastPredictions:[]
    };'''
)

# Add btnExport to DOM elements
js_content = js_content.replace(
    '''        btnReset:          document.getElementById('btn-reset'),''',
    '''        btnReset:          document.getElementById('btn-reset'),
        btnExport:         document.getElementById('btn-export'),'''
)

# Fix link activation logic for mobile
js_content = js_content.replace(
    '''        el.navLinks.forEach(link => {
            const isActive = link.id === `nav-${pageId}`;
            link.classList.toggle('active', isActive);
            link.classList.toggle('text-gray-300', !isActive);
        });''',
    '''        el.navLinks.forEach(link => {
            const isActive = link.id === `nav-${pageId}` || link.id === `nav-mobile-${pageId}`;
            link.classList.toggle('active', isActive);
            
            // For desktop
            if(link.id.startsWith('nav-') && !link.id.startsWith('nav-mobile-')) {
                link.classList.toggle('text-gray-300', !isActive);
            }
            // For mobile
            if(link.id.startsWith('nav-mobile-')) {
                link.classList.toggle('text-gray-400', !isActive);
                link.classList.toggle('text-navy-900', isActive);
            }
        });'''
)

js_content = js_content.replace(
    '''        link.addEventListener('click', e => {
            e.preventDefault();
            switchPage(link.id.replace('nav-', ''));
        });''',
    '''        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.id.replace('nav-mobile-', '').replace('nav-', '');
            switchPage(id);
        });'''
)

# Store prediction and show export button
js_content = js_content.replace(
    '''                    if (result.season) updateSeasonDisplay(month);
                    showResult(result.prediction);''',
    '''                    if (result.season) updateSeasonDisplay(month);
                    showResult(result.prediction);
                    state.lastPredictions.push({
                        Year: year,
                        Month: month,
                        Predicted_Passengers: Math.round(result.prediction)
                    });
                    if (el.btnExport) el.btnExport.classList.remove('hidden');'''
)

# Add Export logic
js_content = js_content.replace(
    '''    el.btnReset.addEventListener('click', () => {''',
    '''    if (el.btnExport) {
        el.btnExport.addEventListener('click', async () => {
            if (state.lastPredictions.length === 0) return;
            try {
                const response = await fetch(`${state.apiBase}/export`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ predictions: state.lastPredictions })
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
                alert('Export failed. Make sure the backend is running.');
            }
        });
    }

    el.btnReset.addEventListener('click', () => {'''
)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated js/app.js")
