document.addEventListener('DOMContentLoaded', async () => {
    await build_index();

    const logoutButton = document.querySelector('.logout-button');
    const loginButton = document.querySelector('.login-button');
    const newSkillButton = document.querySelector('.newSkill-button');
    const dashboardButton = document.querySelector('.dashboard-button');
    const leaderboardButton = document.querySelector('.leaderboard-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    if (newSkillButton) {
        newSkillButton.addEventListener('click', addNewSkill);
    }

    if (dashboardButton) {
        dashboardButton.addEventListener('click', dashboard);
    }

    if (leaderboardButton) {
        leaderboardButton.addEventListener('click', leaderboard);
    }

});

export async function build_index() {
    const response = await fetch('http://localhost:3000/api/skills');
    const data = await response.json();

    const unverifiedResponse = await fetch('http://localhost:3000/skills/unverifiedSkills');
    const unverifiedData = await unverifiedResponse.json();
    const unverifiedMap = new Map(unverifiedData.map(item => [item.skillId, item.count]));

    const verifiedResponse = await fetch('http://localhost:3000/skills/verifiedSkills');
    const verifiedData = await verifiedResponse.json();
    const verifiedMap = new Map(verifiedData.map(item => [item.skillId, { count: item.count, adminVerified: item.adminVerified }]));
    const container = document.querySelector(".svg-container");
    const role = document.querySelector('.role').textContent;

    data.forEach(item => {
        const svgWrapper = document.createElement('div');
        svgWrapper.classList.add('svg-wrapper');
        svgWrapper.setAttribute('data-id', item.id);
        svgWrapper.setAttribute('data-custom', 'false');
        container.appendChild(svgWrapper);

        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon');
        editIcon.style.display = 'none';
        svgWrapper.appendChild(editIcon);

        const notebookIcon = document.createElement('i');
        notebookIcon.classList.add('fas', 'fa-book', 'notebook-icon');
        notebookIcon.style.display = 'none';
        svgWrapper.appendChild(notebookIcon);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 100 100');
        svgWrapper.appendChild(svg);

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
        polygon.classList.add('hexagon');
        svg.appendChild(polygon);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', '50%');
        text.setAttribute('y', '20%');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'black');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('style', 'dominant-baseline: middle;');

        const textArray = item.text.split('\r\n').map(t => t.trim()).filter(t => t.length > 0);
        textArray.forEach((tspanText) => {
            const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan.setAttribute('x', '50%');
            tspan.setAttribute('dy', '1.2em');
            tspan.textContent = tspanText;
            text.appendChild(tspan);
        });

        svg.appendChild(text);

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute('x', '35%');
        image.setAttribute('y', '60%');
        image.setAttribute('width', '30');
        image.setAttribute('height', '30');
        image.setAttribute('href', item.icon);
        svg.appendChild(image);

        if (verifiedMap.has(item.id)) {
            const { count, adminVerified } = verifiedMap.get(item.id);
            const canvas = document.createElement('canvas');
            canvas.classList.add('verified-canvas');
            canvas.width = 20;
            canvas.height = 20;
            canvas.style.position = 'absolute';
            canvas.style.top = '0px';
            canvas.style.right = '5px';

            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(10, 10, 9, 0, 2 * Math.PI);
            ctx.fillStyle = 'green';
            ctx.fill();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(count, 9, 11);

            if (adminVerified || count > 2) {
                polygon.style.fill = 'green';
            }

            svgWrapper.appendChild(canvas);
        }

        if (unverifiedMap.has(item.id)) {
            const count = unverifiedMap.get(item.id);

            const canvas = document.createElement('canvas');
            canvas.classList.add('unverified-canvas');
            canvas.width = 20;
            canvas.height = 20;
            canvas.style.position = 'absolute';
            canvas.style.top = '0px';
            canvas.style.left = '5px';

            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(10, 10, 9, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(count, 9, 11);

            svgWrapper.appendChild(canvas);
        }

        svgWrapper.addEventListener('mouseover', () => {
            svgWrapper.classList.add('expanded');
            editIcon.style.display = role.trim().replace(/['"]/g, '').toLowerCase() === 'admin' ? 'block' : 'none';
            notebookIcon.style.display = 'block';

            const descriptionDiv = document.querySelector('.description-index');
            descriptionDiv.textContent = item.description;
            descriptionDiv.style.backgroundColor = '#f1e187';
            descriptionDiv.style.color = 'black';
            descriptionDiv.style.borderTop = '1px solid black';
        });

        svgWrapper.addEventListener('mouseleave', () => {
            svgWrapper.classList.remove('expanded');
            editIcon.style.display = 'none';
            notebookIcon.style.display = 'none';

            const descriptionDiv = document.querySelector('.description-index');
            descriptionDiv.textContent = '';
            descriptionDiv.style.backgroundColor = '';
            descriptionDiv.style.color = '';
            descriptionDiv.style.borderTop = 'none';
        });

        notebookIcon.addEventListener('click', async (event) => {
            event.stopPropagation();
            const skillTree = 'electronics';
            window.location.href = `/skills/${skillTree}/view/${item.id}`;
        });

        editIcon.addEventListener('click', async (event) => {
            event.stopPropagation();
            const skillTree = 'electronics';
            window.location.href = `/skills/${skillTree}/edit/${item.id}`;
        });
    });

    if (role.trim().replace(/['"]/g, '').toLowerCase() === 'admin') {
        const addSkillContainer = document.querySelector('#addSkillContainer');
        const dashboardContainer = document.querySelector('#dashboardContainer');
        const leaderboardContainer = document.querySelector('#leaderboardContainer');
        addSkillContainer.style.display = 'block';
        dashboardContainer.style.display = 'block';
        leaderboardContainer.style.display = 'block';
    }
}


async function logout() {
    try {
        const response = await fetch('/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            window.location.href = '/users/login';
        } else {
            console.error('Logout failed', response.status);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

async function login() {
    window.location.href = '/users/login';
}

async function addNewSkill() {
    const skillTree = 'electronics';
    window.location.href = `/skills/${skillTree}/add`;
}

async function dashboard() {
    window.location.href = `admin/dashboard`;
}

async function leaderboard() {
    window.location.href = `users/leaderboard`;
}