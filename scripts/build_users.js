document.addEventListener('DOMContentLoaded', async () => {
    await build_users();
    sendNewPassword();
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
        const lockIcon = document.createElement('i');

        passwordBtn.classList.add('editBtn');
        lockIcon.classList.add('fa-solid', 'fa-lock');
        passwordBtn.onclick = () => {
            showChangePasswordForm(item.username);
        };

        passwordBtn.appendChild(lockIcon);
        passwordBtn.appendChild(document.createTextNode(' Change Password'));
        actions.appendChild(passwordBtn);
        tr.appendChild(actions);
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

function showChangePasswordForm(username) {
    const container = document.querySelector('.formContainer');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    passwordInput.value = '';
    usernameInput.value = username;
    if (container.style.display === 'none') {
        container.style.display = 'block';
    }
}

function sendNewPassword() {
    const changeBtn = document.querySelector('.changeBtn');
    const infoModal = document.getElementById('info-modal');
    const modalContent = document.querySelector('.modal-content p');
    const closeModal = document.getElementById('close-modal');

    changeBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (password.length < 6) {
            modalContent.textContent = 'Password must be at least 6 characters long.';
            infoModal.classList.remove('hidden');
            closeModal.addEventListener('click', () => {
                infoModal.classList.add('hidden');
            }, { once: true });
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/admin/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: username, newPassword: password }),
            });

            if (response.ok) {
                modalContent.textContent = 'User password changed successfully!';
            } else {
                const errorMessage = await response.text();
                modalContent.textContent = `${errorMessage}`;
            }

            infoModal.classList.remove('hidden');
            closeModal.addEventListener('click', () => {
                infoModal.classList.add('hidden');
                if (response.ok) window.location.reload();
            }, { once: true });
        } catch (error) {
            console.error('Error changing password:', error);
            modalContent.textContent = 'An unexpected error occurred.';
            infoModal.classList.remove('hidden');
            closeModal.addEventListener('click', () => {
                infoModal.classList.add('hidden');
            }, { once: true });
        }
    });
}
