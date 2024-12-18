document.addEventListener('DOMContentLoaded', async () => {
    await build_leaderboard();
});

async function build_leaderboard() {
    const badges_response = await fetch('http://localhost:3000/api/badges');
    const badges = await badges_response.json();

    const users_response = await fetch('http://localhost:3000/api/users');
    const users = await users_response.json();

    badges.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('leaderboard-div');
        const h2 = document.createElement('h2');
        h2.textContent = item.name;
        div.appendChild(h2);
        const table = document.createElement('table');
        table.classList.add('leaderboard-table');
        const thead = document.createElement('thead');
        const trhead = document.createElement('tr');
        const th1 = document.createElement('th');
        const th2 = document.createElement('th');
        const th3 = document.createElement('th');
        const th4 = document.createElement('th');

        th1.textContent = 'Rank';
        th2.textContent = 'Username';
        th3.textContent = 'Score';
        th4.textContent = 'Badge';

        trhead.appendChild(th1);
        trhead.appendChild(th2);
        trhead.appendChild(th3);
        trhead.appendChild(th4);
        thead.appendChild(trhead);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        let rank = 1;
        let hasUsers = false;

        users.forEach(user => {
            if (user.score >= item.bitpoints_min && user.score <= item.bitpoints_max) {
                const trbody = document.createElement('tr');
                trbody.classList.add('leaderboard-row');
                const td1 = document.createElement('td');
                const td2 = document.createElement('td');
                const td3 = document.createElement('td');
                const td4 = document.createElement('td');
                const img = document.createElement('img');
                img.src = item.image_url;
                img.classList.add('badge-img');
                td4.appendChild(img);

                td1.textContent = String(rank);
                td2.textContent = user.username;
                td3.textContent = user.score;

                trbody.appendChild(td1);
                trbody.appendChild(td2);
                trbody.appendChild(td3);
                trbody.appendChild(td4);
                tbody.appendChild(trbody);
                rank++;
                hasUsers = true;
            }
        });

        if (!hasUsers) {
            const noUsersRow = document.createElement('tr');
            const noUsersCell = document.createElement('td');
            noUsersCell.colSpan = 4;
            noUsersCell.textContent = "No users in this range yet";
            noUsersRow.appendChild(noUsersCell);
            tbody.appendChild(noUsersRow);
        }

        table.appendChild(tbody);
        div.appendChild(table);
        document.body.appendChild(div);
    });
}
