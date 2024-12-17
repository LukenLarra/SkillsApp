document.addEventListener('DOMContentLoaded', async () => {
    await build_badges();
    setupModalHandlers();
});

async function build_badges() {
    const response = await fetch('http://localhost:3000/api/badges');
    const data = await response.json();
    const table = document.querySelector(".range-table");
    const tbody = document.createElement('tbody');

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        table.appendChild(tr);

        const name = document.createElement('td');
        name.textContent = item.name;
        tr.appendChild(name);

        const badge = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image_url;
        badge.appendChild(img);
        tr.appendChild(badge);

        const bitpoint = document.createElement('td');
        bitpoint.textContent = `${item.bitpoints_min} - ${item.bitpoints_max}`;
        tr.appendChild(bitpoint);

        const action = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.onclick = () => {
            window.location.href = `/admin/badges/edit/${item.name}`;
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.onclick = () => {
            showDeleteModal(item.name);
        };

        editBtn.textContent = 'Edit';
        deleteBtn.textContent = 'Delete';
        editBtn.classList.add('editBtn');
        deleteBtn.classList.add('deleteBtn');

        action.appendChild(editBtn);
        action.appendChild(deleteBtn);
        tr.appendChild(action);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

function setupModalHandlers() {
    const modal = document.getElementById('confirmation-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');

    confirmDeleteButton.addEventListener('click', async () => {
        const badgeName = modal.getAttribute('data-id');
        if (badgeName) {
            try {
                const response = await fetch(`/admin/badges/delete/${badgeName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: badgeName })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    cancelDeleteButton.addEventListener('click', () => {
        hideModal();
    });
}

function showDeleteModal(badgeName) {
    const modal = document.getElementById('confirmation-modal');
    modal.setAttribute('data-id', badgeName);
    modal.classList.remove('hidden');
}

function hideModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.setAttribute('data-id', '');
    modal.classList.add('hidden');
}
