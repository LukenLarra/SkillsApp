document.addEventListener('DOMContentLoaded', async () => {
    await build_users();
});


async function build_users() {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    const table = document.querySelector(".users-table");

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const th_username = document.createElement('th');
    th_username.textContent = 'Username';
    const th_admin = document.createElement('th');
    th_admin.textContent = 'Admin';
    const th_actions = document.createElement('th');
    th_actions.textContent = 'Actions';

    tr.appendChild(th_username);
    tr.appendChild(th_admin);
    tr.appendChild(th_actions);

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        table.appendChild(tr);

        const username = document.createElement('td');
        username.textContent = item.username;
        tr.appendChild(username);

        const admin = document.createElement('td');
        admin.textContent = item.admin ? 'Yes' : 'No';
        tr.appendChild(admin);

        const actions = document.createElement('td');
        const passwordBtn = document.createElement('button');
        passwordBtn.textContent = 'Change Password';
        passwordBtn.classList.add('editBtn');
        passwordBtn.onclick = () => {

        };

        actions.appendChild(passwordBtn);
        tr.appendChild(actions);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}