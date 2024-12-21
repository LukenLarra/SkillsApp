document.addEventListener('DOMContentLoaded', async () => {
    await build_badges();
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
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid', 'fa-pencil');
        editBtn.classList.add('editBtn');

        editBtn.appendChild(editIcon);
        editBtn.appendChild(document.createTextNode(' Edit'));

        editBtn.onclick = () => {
            window.location.href = `/admin/badges/edit/${item.name}`;
        };

        const deleteBtn = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash');
        deleteBtn.classList.add('deleteBtn');

        deleteBtn.appendChild(deleteIcon);
        deleteBtn.appendChild(document.createTextNode(' Delete'));

        deleteBtn.onclick = async () => {
            try {
                const response = await fetch(`/admin/badges/delete/${item.name}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: item.name })
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
        };

        action.appendChild(editBtn);
        action.appendChild(deleteBtn);
        tr.appendChild(action);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}
