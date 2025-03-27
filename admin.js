// Function to fetch users from the server
function fetchUsers() {
    fetch('/admin/view-users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            const table = document.getElementById('user-table');
            table.innerHTML = ''; // Clear existing rows

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.USER_NAME}</td>
                    <td>${user.MAIL_ID}</td>
                    <td>${user.SCORE}</td>
                    <td>${user.ESTIMATED_TIME}</td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Check the console for details.');
        });
}

// Function to filter the table based on search input
function filterTable() {
    const input = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#user-table tr');

    rows.forEach(row => {
        const username = row.cells[0].innerText.toLowerCase();
        const email = row.cells[1].innerText.toLowerCase();
        row.style.display = (username.includes(input) || email.includes(input)) ? '' : 'none';
    });
}

// Function to sort the table by column
function sortTable(n) {
    const table = document.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const ascending = table.getAttribute('data-sort') !== 'asc';

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[n].innerText;
        const cellB = rowB.cells[n].innerText;
        return ascending ? cellA.localeCompare(cellB, undefined, { numeric: true }) : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    // Clear and re-append sorted rows
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    // Toggle sorting order
    table.setAttribute('data-sort', ascending ? 'asc' : 'desc');
}

// Fetch users when the page loads
window.onload = fetchUsers;