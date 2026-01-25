// Database simulation using localStorage
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.fraudAlerts = JSON.parse(localStorage.getItem('fraudAlerts')) || [];
        
        // Initialize with sample data if empty
        if (this.users.length === 0) {
            this.initializeSampleData();
        }
    }
    
    initializeSampleData() {
        // Sample users
        this.users = [
            { user_id: 1, name: 'Neha', email: 'neha@gmail.com', phone: '9876543210', registration_date: '2022-01-01' },
            { user_id: 2, name: 'Ravi', email: 'ravi@gmail.com', phone: '9876501234', registration_date: '2022-02-01' },
            { user_id: 3, name: 'Priya', email: 'priya@gmail.com', phone: '9876512345', registration_date: '2022-03-15' },
            { user_id: 4, name: 'Amit', email: 'amit@gmail.com', phone: '9876523456', registration_date: '2022-04-20' }
        ];
        
        // Sample transactions
        this.transactions = [
            { transaction_id: 1001, user_id: 1, amount: 20000, location: 'Delhi', transaction_time: '2025-04-01T09:00:00', status: 'Valid' },
            { transaction_id: 1002, user_id: 2, amount: 75000, location: 'Russia', transaction_time: '2025-04-01T09:10:00', status: 'Fraud' }
        ];
        
        // Sample fraud alerts
        this.fraudAlerts = [
            { alert_id: 1, transaction_id: 1002, reason: 'Unusual location', alert_time: '2025-04-01T09:15:00', status: 'confirmed' }
        ];
        
        this.saveAll();
    }
    
    saveAll() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('fraudAlerts', JSON.stringify(this.fraudAlerts));
    }
    
    // User methods
    getUsers() {
        return this.users;
    }
    
    addUser(user) {
        // Auto-generate ID if not provided
        if (!user.user_id) {
            const maxId = Math.max(...this.users.map(u => u.user_id), 0);
            user.user_id = maxId + 1;
        }
        
        // Set default registration date if not provided
        if (!user.registration_date) {
            user.registration_date = new Date().toISOString().split('T')[0];
        }
        
        this.users.push(user);
        this.saveAll();
        return user;
    }
    
    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.user_id === userId);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.saveAll();
            return true;
        }
        return false;
    }
    
    // Transaction methods
    getTransactions() {
        return this.transactions.map(tx => {
            const user = this.users.find(u => u.user_id === tx.user_id);
            return {
                ...tx,
                user_name: user ? user.name : 'Unknown'
            };
        });
    }
    
    addTransaction(transaction) {
        // Auto-generate ID if not provided
        if (!transaction.transaction_id) {
            const maxId = Math.max(...this.transactions.map(t => t.transaction_id), 0);
            transaction.transaction_id = maxId + 1;
        }
        
        // Set default time if not provided
        if (!transaction.transaction_time) {
            transaction.transaction_time = new Date().toISOString();
        }
        
        // Set default status if not provided
        if (!transaction.status) {
            transaction.status = 'Valid';
        }
        
        this.transactions.push(transaction);
        
        // Check for fraud triggers
        this.checkForFraud(transaction);
        
        this.saveAll();
        return transaction;
    }
    
    checkForFraud(transaction) {
        // High amount trigger (> 50000)
        if (transaction.amount > 50000) {
            this.createFraudAlert(transaction.transaction_id, 'High amount');
        }
        
        // Blacklisted location trigger
        if (['Russia', 'North Korea'].includes(transaction.location)) {
            this.createFraudAlert(transaction.transaction_id, 'Blacklisted location');
        }
        
        // Unusual time trigger (between 10PM and 6AM)
        const txTime = new Date(transaction.transaction_time);
        const hours = txTime.getHours();
        if (hours < 6 || hours >= 22) {
            this.createFraudAlert(transaction.transaction_id, 'Unusual time');
        }
    }
    
    // Fraud alert methods
    getFraudAlerts() {
        return this.fraudAlerts.map(alert => {
            const transaction = this.transactions.find(t => t.transaction_id === alert.transaction_id);
            const user = transaction ? this.users.find(u => u.user_id === transaction.user_id) : null;
            
            return {
                ...alert,
                amount: transaction ? transaction.amount : 0,
                location: transaction ? transaction.location : 'Unknown',
                transaction_time: transaction ? transaction.transaction_time : '',
                user_name: user ? user.name : 'Unknown'
            };
        });
    }
    
    createFraudAlert(transaction_id, reason) {
        // Update transaction status to Fraud
        const txIndex = this.transactions.findIndex(t => t.transaction_id === transaction_id);
        if (txIndex !== -1) {
            this.transactions[txIndex].status = 'Fraud';
        }
        
        // Create new alert
        const maxId = Math.max(...this.fraudAlerts.map(a => a.alert_id), 0);
        const newAlert = {
            alert_id: maxId + 1,
            transaction_id,
            reason,
            alert_time: new Date().toISOString(),
            status: 'pending'
        };
        
        this.fraudAlerts.push(newAlert);
        this.saveAll();
        return newAlert;
    }
    
    updateFraudAlertStatus(alert_id, status) {
        const alert = this.fraudAlerts.find(a => a.alert_id === alert_id);
        if (alert) {
            alert.status = status;
            this.saveAll();
            return true;
        }
        return false;
    }
    
    // Report methods
    generateFraudReport() {
        return this.fraudAlerts.map(alert => {
            const transaction = this.transactions.find(t => t.transaction_id === alert.transaction_id);
            const user = transaction ? this.users.find(u => u.user_id === transaction.user_id) : null;
            
            return {
                transaction_id: alert.transaction_id,
                name: user ? user.name : 'Unknown',
                email: user ? user.email : '',
                amount: transaction ? transaction.amount : 0,
                location: transaction ? transaction.location : 'Unknown',
                transaction_time: transaction ? transaction.transaction_time : '',
                reason: alert.reason
            };
        });
    }
    
    getFlaggedTransactions() {
        return this.transactions.filter(t => t.status === 'Fraud');
    }
    
    getHighValueTransactions() {
        return this.transactions.filter(t => t.amount > 50000);
    }
    
    getDailyAlertSummary() {
        const summary = {};
        
        this.fraudAlerts.forEach(alert => {
            const date = alert.alert_time.split('T')[0];
            summary[date] = (summary[date] || 0) + 1;
        });
        
        return Object.entries(summary).map(([date, total_alerts]) => ({
            date,
            total_alerts
        }));
    }
}

// Initialize database
const db = new Database();

// UI Functions
function showDashboard() {
    const dailyAlerts = db.getDailyAlertSummary();
    const recentAlerts = db.getFraudAlerts().slice(0, 5);
    const highValueTx = db.getHighValueTransactions().slice(0, 5);
    
    // Prepare chart data
    const chartLabels = dailyAlerts.map(item => item.date);
    const chartData = dailyAlerts.map(item => item.total_alerts);
    
    // Create HTML
    let content = `
        <div class="row">
            <div class="col-md-12">
                <h2>Dashboard</h2>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Daily Alerts</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="alertsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Recent Fraud Alerts</h5>
                    </div>
                    <div class="card-body">
                        <div id="recentAlerts"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5>High Value Transactions</h5>
                    </div>
                    <div class="card-body">
                        <div id="highValueTransactions"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = content;
    
    // Render chart
    const ctx = document.getElementById('alertsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Fraud Alerts',
                data: chartData,
                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Render recent alerts
    let recentAlertsHtml = '<ul class="list-group">';
    recentAlerts.forEach(alert => {
        const alertDate = new Date(alert.alert_time).toLocaleString();
        recentAlertsHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>Transaction #${alert.transaction_id}</strong> - ${alert.reason}
                    <br>
                    <small>${alertDate}</small>
                </div>
                <span class="status-badge status-${alert.status}">${alert.status.replace('_', ' ')}</span>
            </li>
        `;
    });
    recentAlertsHtml += '</ul>';
    document.getElementById('recentAlerts').innerHTML = recentAlertsHtml;
    
    // Render high value transactions
    let highValueHtml = '<table class="table table-sm"><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Location</th><th>Status</th></tr></thead><tbody>';
    highValueTx.forEach(tx => {
        highValueHtml += `
            <tr>
                <td>${tx.transaction_id}</td>
                <td>${tx.user_name || 'Unknown'}</td>
                <td>${tx.amount.toLocaleString()}</td>
                <td>${tx.location}</td>
                <td><span class="badge ${tx.status === 'Fraud' ? 'badge-fraud' : 'badge-valid'}">${tx.status}</span></td>
            </tr>
        `;
    });
    highValueHtml += '</tbody></table>';
    document.getElementById('highValueTransactions').innerHTML = highValueHtml;
}

function showUsers() {
    const users = db.getUsers();
    
    let rows = '';
    users.forEach(user => {
        rows += `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.registration_date}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    const content = `
        <div class="row">
            <div class="col-md-12">
                <h2>Users</h2>
                <hr>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Add New User</h5>
                    </div>
                    <div class="card-body">
                        <form id="userForm">
                            <div class="mb-3">
                                <label for="userName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="userName" required>
                            </div>
                            <div class="mb-3">
                                <label for="userEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="userEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="userPhone" class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="userPhone" required>
                            </div>
                            <div class="mb-3">
                                <label for="userRegDate" class="form-label">Registration Date</label>
                                <input type="date" class="form-control" id="userRegDate" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Add User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = content;
    
    // Add form submit handler
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            registration_date: document.getElementById('userRegDate').value
        };
        
        db.addUser(user);
        alert('User added successfully!');
        showUsers();
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        if (db.deleteUser(userId)) {
            showUsers();
        }
    }
}

function showTransactions() {
    const transactions = db.getTransactions();
    
    let rows = '';
    transactions.forEach(tx => {
        const txDate = new Date(tx.transaction_time).toLocaleString();
        rows += `
            <tr>
                <td>${tx.transaction_id}</td>
                <td>${tx.user_name || tx.user_id}</td>
                <td>${tx.amount.toLocaleString()}</td>
                <td>${tx.location}</td>
                <td>${txDate}</td>
                <td><span class="badge rounded-pill ${tx.status === 'Fraud' ? 'badge-fraud' : 'badge-valid'}">${tx.status}</span></td>
            </tr>
        `;
    });
    
    const content = `
        <div class="row">
            <div class="col-md-12">
                <h2>Transactions</h2>
                <hr>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Location</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Add New Transaction</h5>
                    </div>
                    <div class="card-body">
                        <form id="transactionForm">
                            <div class="mb-3">
                                <label for="userId" class="form-label">User</label>
                                <select class="form-select" id="userId" required>
                                    ${db.getUsers().map(user => 
                                        `<option value="${user.user_id}">${user.name} (${user.user_id})</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="amount" class="form-label">Amount</label>
                                <input type="number" step="0.01" class="form-control" id="amount" required>
                            </div>
                            <div class="mb-3">
                                <label for="location" class="form-label">Location</label>
                                <input type="text" class="form-control" id="location" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = content;
    
    // Add form submit handler
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transaction = {
            user_id: parseInt(document.getElementById('userId').value),
            amount: parseFloat(document.getElementById('amount').value),
            location: document.getElementById('location').value
        };
        
        db.addTransaction(transaction);
        alert('Transaction added successfully!');
        showTransactions();
    });
}

function showFraudAlerts() {
    const alerts = db.getFraudAlerts();
    
    let rows = '';
    alerts.forEach(alert => {
        const txDate = new Date(alert.transaction_time).toLocaleString();
        const alertDate = new Date(alert.alert_time).toLocaleString();
        rows += `
            <tr>
                <td>${alert.alert_id}</td>
                <td>${alert.transaction_id}</td>
                <td>${alert.user_name}</td>
                <td>${alert.amount.toLocaleString()}</td>
                <td>${alert.location}</td>
                <td>${txDate}</td>
                <td>${alert.reason}</td>
                <td>${alertDate}</td>
                <td>
                    <select class="form-select status-select" data-id="${alert.alert_id}">
                        <option value="pending" ${alert.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${alert.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="false_positive" ${alert.status === 'false_positive' ? 'selected' : ''}>False Positive</option>
                    </select>
                </td>
            </tr>
        `;
    });
    
    const content = `
        <div class="row">
            <div class="col-md-12">
                <h2>Fraud Alerts</h2>
                <hr>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Alert ID</th>
                                <th>Transaction ID</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Location</th>
                                <th>Transaction Time</th>
                                <th>Reason</th>
                                <th>Alert Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('content').innerHTML = content;
    
    // Add event listeners for status changes
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const alertId = parseInt(this.dataset.id);
            const newStatus = this.value;
            
            if (db.updateFraudAlertStatus(alertId, newStatus)) {
                showFraudAlerts();
            }
        });
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    showDashboard();
});