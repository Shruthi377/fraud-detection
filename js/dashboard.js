document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard stats
    fetchDashboardStats();
    
    // Load recent alerts
    fetchRecentAlerts();
    
    // Set up chart
    setupLocationChart();
});

function fetchDashboardStats() {
    fetch('api/users.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalUsers').textContent = data.data.length;
        });
    
    fetch('api/transactions.php')
        .then(response => response.json())
        .then(data => {
            const valid = data.data.filter(t => t.status === 'Valid').length;
            document.getElementById('validTransactions').textContent = valid;
        });
    
    fetch('api/alerts.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('fraudAlerts').textContent = data.data.length;
        });
}

function fetchRecentAlerts() {
    fetch('api/alerts.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#recentAlertsTable tbody');
            tableBody.innerHTML = '';
            
            data.data.slice(0, 5).forEach(alert => {
                const row = document.createElement('tr');
                if (alert.reason.toLowerCase().includes('high')) {
                    row.classList.add('table-danger');
                }
                
                row.innerHTML = `
                    <td>${alert.alert_id}</td>
                    <td>${alert.user_name}</td>
                    <td>$${alert.amount.toLocaleString()}</td>
                    <td>${alert.location}</td>
                    <td><span class="badge bg-danger">${alert.reason}</span></td>
                    <td>${new Date(alert.alert_time).toLocaleString()}</td>
                `;
                
                tableBody.appendChild(row);
            });
        });
}

function setupLocationChart() {
    fetch('api/alerts.php')
        .then(response => response.json())
        .then(data => {
            const locations = {};
            data.data.forEach(alert => {
                locations[alert.location] = (locations[alert.location] || 0) + 1;
            });
            
            const ctx = document.getElementById('locationChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(locations),
                    datasets: [{
                        data: Object.values(locations),
                        backgroundColor: [
                            '#ff6384',
                            '#36a2eb',
                            '#ffce56',
                            '#4bc0c0',
                            '#9966ff'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        });
}