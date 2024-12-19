document.addEventListener('DOMContentLoaded', async () => {
    await build_leaderboard();
});

async function build_leaderboard() {
    const [badges_response, users_response] = await Promise.all([
        fetch('http://localhost:3000/api/badges'),
        fetch('http://localhost:3000/api/users')
    ]);
    const [badges, users] = await Promise.all([
        badges_response.json(),
        users_response.json()
    ]);

    document.body.appendChild(createElement('h1', 'Leaderboard'));

    const tableRange = createTable(['Range', 'Badge', 'Required Bitpoints'], 'range-table');
    const tbodyRange = document.createElement('tbody');

    badges.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('leaderboard-div');
        div.appendChild(createElement('h2', item.name));

        const table = createTable(['Rank', 'Username', 'Score', 'Badge'], 'leaderboard-table');
        const tbody = document.createElement('tbody');
        let rank = 1;
        let hasUsers = false;

        users.forEach(user => {
            if (user.score >= item.bitpoints_min && user.score <= item.bitpoints_max) {
                const trbody = document.createElement('tr');
                trbody.classList.add('leaderboard-row');
                trbody.appendChild(createElement('td', rank++));
                trbody.appendChild(createElement('td', user.username));
                trbody.appendChild(createElement('td', user.score));
                trbody.appendChild(createImageCell(item.image_url, 'badge-img'));
                tbody.appendChild(trbody);
                hasUsers = true;
            }
        });

        if (!hasUsers) {
            const noUsersRow = document.createElement('tr');
            const noUsersCell = createElement('td', "No users in this range yet");
            noUsersCell.colSpan = 4;
            noUsersRow.appendChild(noUsersCell);
            tbody.appendChild(noUsersRow);
        }

        table.appendChild(tbody);
        div.appendChild(table);
        document.body.appendChild(div);

        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        tr.appendChild(createElement('td', item.name));
        tr.appendChild(createImageCell(item.image_url, 'badge-img'));
        tr.appendChild(createElement('td', `${item.bitpoints_min} - ${item.bitpoints_max}`));
        tbodyRange.appendChild(tr);
    });

    tableRange.appendChild(tbodyRange);
    document.body.appendChild(createElement('h1', 'Range Explanations'));
    document.body.appendChild(tableRange);
}

function createTable(headers, className) {
    const table = document.createElement('table');
    table.classList.add(className);
    const thead = document.createElement('thead');
    const trhead = document.createElement('tr');
    headers.forEach(header => trhead.appendChild(createElement('th', header)));
    thead.appendChild(trhead);
    table.appendChild(thead);
    return table;
}

function createElement(tag, textContent) {
    const element = document.createElement(tag);
    element.textContent = textContent;
    return element;
}

function createImageCell(src, className) {
    const td = document.createElement('td');
    const img = document.createElement('img');
    img.src = src;
    img.classList.add(className);
    td.appendChild(img);
    return td;
}
