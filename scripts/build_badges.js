document.addEventListener('DOMContentLoaded', async () => {
    await build_badges();
});

async function build_badges(){
    const response = await fetch('http://localhost:3000/api/badges');
    const data = await response.json();
    const table = document.querySelector(".range-table");
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        table.appendChild(tr);

        const range = document.createElement('td');
        range.textContent = item.range;
        tr.appendChild(range);

        const badge = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.png;
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
            window.location.href = `/admin/badges/delete/${item.name}`;
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