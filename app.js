// Fetch and display sentiment distribution
fetch('http://127.0.0.1:5000/sentiment-distribution')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        const sentimentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Sentiment Count',
                    data: Object.values(data),
                    backgroundColor: ['#4caf50', '#ff5722', '#2196f3'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    });

// Fetch and display extracted features
fetch('http://127.0.0.1:5000/extracted-features')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('featuresChart').getContext('2d');
        const featuresChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Feature Count',
                    data: Object.values(data),
                    backgroundColor: '#007bff',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    });

// Fetch and display rating discrepancies
fetch('http://127.0.0.1:5000/rating-discrepancies')
    .then(response => response.json())
    .then(data => {
        const discrepanciesList = document.getElementById('discrepanciesList');
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Review: "${item.review}" - Rating: ${item.rating}`;
            discrepanciesList.appendChild(li);
        });
    });
