document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultSection = document.getElementById('result-section');
    const predictionVal = document.getElementById('prediction-val');
    const loader = document.getElementById('loader');
    const predictBtn = document.getElementById('predict-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const price = document.getElementById('price').value;

        // Visual feedback - Show loader, hide text
        loader.style.display = 'inline-block';
        const btnText = predictBtn.querySelector('span');
        if (btnText) btnText.style.visibility = 'hidden';
        predictBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, month, price })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                resultSection.style.display = 'block';
                // Animate result for professional feel
                animateValue(predictionVal, 0, Math.round(data.prediction), 800);
                
                // Scroll to result for visibility
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert('Analysis Error: ' + data.error);
            }
        } catch (err) {
            console.error('API Connection Error:', err);
            alert('Failed to connect to SkyMetrics Enterprise API.');
        } finally {
            // Restore button state
            loader.style.display = 'none';
            if (btnText) btnText.style.visibility = 'visible';
            predictBtn.disabled = false;
        }
    });

    form.addEventListener('reset', () => {
        resultSection.style.display = 'none';
    });
});
