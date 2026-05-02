document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const resultSection = document.getElementById('result-section');
    const predictionVal = document.getElementById('prediction-val');
    const loader = document.getElementById('loader');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const price = document.getElementById('price').value;

        // Visual feedback
        loader.style.display = 'block';
        const btnText = e.submitter.querySelector('span');
        if (btnText) btnText.style.visibility = 'hidden';
        e.submitter.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, month, price })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                resultSection.style.display = 'block';
                animateValue(predictionVal, 0, Math.round(data.prediction), 1000);
                
                // Scroll to result
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to SkyLink API.');
        } finally {
            loader.style.display = 'none';
            if (btnText) btnText.style.visibility = 'visible';
            e.submitter.disabled = false;
        }
    });

    form.addEventListener('reset', () => {
        resultSection.style.display = 'none';
    });
});
