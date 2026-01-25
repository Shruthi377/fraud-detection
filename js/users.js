document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});

function fetchUsers() {
    fetch('api/users.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#usersTable tbody');
            tableBody.innerHTML = '';
            
            data.data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.registration_date}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewUser(${user.user_id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.user_id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

function addUser() {
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        registration_date: document.getElementById('registration_date').value
    };
    
    fetch('api/users.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            $('#addUserModal').modal('hide');
            document.getElementById('addUserForm').reset();
            fetchUsers();
        }
    });
}

function viewUser(userId) {
    // Implement view user details functionality
    alert('View user: ' + userId);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        // Implement delete functionality
        alert('Delete user: ' + userId);
    }
}