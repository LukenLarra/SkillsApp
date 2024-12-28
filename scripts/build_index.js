import {getCurrentUser} from "./currentUser.js";

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

async function build_index() {
    const skill_response = await fetch('http://localhost:3000/api/skills');
    const allSkills = await skill_response.json();

    const userskill_response = await fetch(`http://localhost:3000/api/userSkills`);
    const userSkills = await userskill_response.json();

    const user_response = await fetch('http://localhost:3000/api/users');
    const allUsers = await user_response.json();

    let currentUser = getCurrentUser();
    currentUser = allUsers.find(u => u.username === currentUser);

    const container = document.querySelector(".svg-container");
    const role = document.querySelector('.role') ? document.querySelector('.role').textContent : null;

    allSkills.forEach(item => {
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

        const leftCanvas = document.createElement('canvas');
        leftCanvas.width = 20;
        leftCanvas.height = 20;
        leftCanvas.style.position = 'absolute';
        leftCanvas.style.left = '5px';
        svgWrapper.appendChild(leftCanvas);

        const rightCanvas = document.createElement('canvas');
        rightCanvas.width = 20;
        rightCanvas.height = 20;
        rightCanvas.style.position = 'absolute';
        rightCanvas.style.right = '5px';
        svgWrapper.appendChild(rightCanvas);

        if (currentUser) {
            const userSkillData = userSkills.filter(us => us.skill._id === item._id);
            const totalEvidences = userSkillData.length;
            const distinctApprovers = new Set(userSkillData.flatMap(us => us.verifications.filter(v => v.approved).map(v => v.user))).size;

            if (totalEvidences > 0) {
                const leftCtx = leftCanvas.getContext('2d');
                leftCtx.beginPath();
                leftCtx.arc(10, 10, 9, 0, 2 * Math.PI);
                leftCtx.fillStyle = 'red';
                leftCtx.fill();
                leftCtx.font = '12px Arial';
                leftCtx.fillStyle = 'white';
                leftCtx.textAlign = 'center';
                leftCtx.textBaseline = 'middle';
                leftCtx.fillText(totalEvidences, 9, 11);
            }

            if (distinctApprovers > 0) {
                const rightCtx = rightCanvas.getContext('2d');
                rightCtx.beginPath();
                rightCtx.arc(10, 10, 9, 0, 2 * Math.PI);
                rightCtx.fillStyle = 'green';
                rightCtx.fill();
                rightCtx.font = '12px Arial';
                rightCtx.fillStyle = 'white';
                rightCtx.textAlign = 'center';
                rightCtx.textBaseline = 'middle';
                rightCtx.fillText(distinctApprovers, 9, 11);
            }

            // Check if any approver is admin
            const approvers = userSkillData.flatMap(us => us.verifications.filter(v => v.approved).map(v => ({
                approverId: v.user,
                submittedBy: us.user
            })));

            const isAdminApprover = approvers.some(({approverId, submittedBy}) => {
                const approver = allUsers.find(u => u._id === approverId);
                return approver && approver.admin && submittedBy._id === currentUser._id;
            });

            if (isAdminApprover || distinctApprovers > 2) {
                polygon.style.fill = 'green';
            }

            svgWrapper.addEventListener('mouseover', () => {
                svgWrapper.classList.add('expanded');
                if (role !== null) {
                    editIcon.style.display = role.trim().replace(/['"]/g, '').toLowerCase() === 'admin' ? 'block' : 'none';
                }
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
                const skillTree = item.set;
                window.location.href = `/skills/${skillTree}/view/${item.id}`;
            });

            editIcon.addEventListener('click', async (event) => {
                event.stopPropagation();
                const skillTree = item.set;
                window.location.href = `/skills/${skillTree}/edit/${item.id}`;
            });
        }
    });

    if (role !== null && role.trim().replace(/['"]/g, '').toLowerCase() === 'admin') {
        const addSkillContainer = document.querySelector('#addSkillContainer');
        const dashboardContainer = document.querySelector('#dashboardContainer');
        const leaderboardContainer = document.querySelector('#leaderboardContainer');
        addSkillContainer.style.display = 'block';
        dashboardContainer.style.display = 'block';
        leaderboardContainer.style.display = 'block';
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