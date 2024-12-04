document.addEventListener('DOMContentLoaded', async () => {
    await build_leaderboard();
});

async function build_leaderboard(){
    const response = await fetch('http://localhost:3000/api/badges');
    const data = await response.json();
    const table = document.querySelector(".range-table");
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        table.appendChild(tr);

        const td = document.createElement('td');
        td.textContent = item.rango;
        tr.appendChild(td);

        const td2 = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.png;
        td2.appendChild(img);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.textContent = `${item.bitpoints_min} - ${item.bitpoints_max}`;
        tr.appendChild(td3);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}