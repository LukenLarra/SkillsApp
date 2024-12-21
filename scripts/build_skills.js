document.addEventListener('DOMContentLoaded', async () => {
    await createSVGSkills();

    const response = await fetch('http://localhost:3000/api/skills');
    const allSkills = await response.json();

    const userskill_response = await fetch('http://localhost:3000/api/userSkills');
    const userSkills = await userskill_response.json();

    const container = document.querySelector(".details-svg");
    const svgId = container.getAttribute("svgId");

    const skill = allSkills.find(item => item.id === Number(svgId));
    const userSkill = userSkills.find(item => item.skill && item.skill.id === skill.id);
    if (userSkill) {
        const role = document.querySelector('.role').textContent;
        if (role.trim().replace(/['"]/g, '').toLowerCase() !== 'standard') {
            createEvidencesTable();
        }
    }
});

async function createSVGSkills() {
    const response = await fetch('http://localhost:3000/api/skills');
    const data = await response.json();
    const container = document.querySelector(".details-svg");
    const svgId = container.getAttribute("svgId");
    const item = data.find(item => item.id === Number(svgId));

    if (!item) {
        console.error(`Skill with id ${svgId} not found`);
        return;
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 100 100');
    container.appendChild(svg);

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
}

async function createEvidencesTable() {
    const section = document.querySelector(".evidence-submission");

    const heading = document.createElement('h2');
    heading.textContent = 'Unverified Evidence Submissions';

    const table = document.createElement('table');
    table.border = '1';

    const headerRow = document.createElement('tr');
    const headers = ['Users', 'Evidences', 'Actions'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const container = document.querySelector(".details-svg");
    const svgId = container.getAttribute("svgId");

    const userskill_response = await fetch(`http://localhost:3000/api/userSkills/${svgId}`);
    const userSkills = await userskill_response.json();

    const dataRow = document.createElement('tr');

    const userTd = document.createElement('td');
    userTd.textContent = userSkills.user?.username || 'Unknown User';
    dataRow.appendChild(userTd);

    const evidenceTd = document.createElement('td');
    evidenceTd.textContent = userSkills.evidence.split('\n') || 'No evidence provided';
    dataRow.appendChild(evidenceTd);

    const actionTd = document.createElement('td');
    const approveButton = document.createElement('button');
    approveButton.textContent = 'Approve';
    approveButton.classList.add('approve-button');
    approveButton.onclick = async () => {
        await handleVerification(userSkills.skill.id, true, userSkills._id);
    }

    const rejectButton = document.createElement('button');
    rejectButton.textContent = 'Reject';
    rejectButton.classList.add('reject-button');
    rejectButton.onclick = async () => {
        await handleVerification(userSkills.skill.id, false, userSkills._id);
    }

    actionTd.appendChild(approveButton);
    actionTd.appendChild(rejectButton);
    dataRow.appendChild(actionTd);
    table.appendChild(dataRow);
    section.appendChild(heading);
    section.appendChild(table);
}

export function showSendEvidence() {
    const section = document.querySelector('.evidence');
    section.innerHTML = '';

    const h2 = document.createElement('h2');
    h2.textContent = 'Provide Evidence';
    h2.classList.add('evidence-title');

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter a URL or explanation as evidence for completing this skill";
    textarea.classList.add('evidence-textarea');

    const button = document.createElement('button');
    button.textContent = 'Submit Evidence';
    button.type = 'button';
    button.classList.add('evidence-submit');
    button.onclick = submitEvidence;

    section.appendChild(h2);
    section.appendChild(textarea);
    section.appendChild(button);
}

async function submitEvidence() {
    const textarea = document.querySelector('.evidence-textarea');
    const evidence = textarea.value.trim();
    if (!evidence) {
        alert('Please provide valid evidence before submitting');
        return;
    }

    const skillTreeName = 'electronics';
    const id = document.querySelector('.details-svg').getAttribute('svgId');

    if (!id) {
        alert('Id not found for the current skill');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/skills/${skillTreeName}/submit-evidence`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, evidence}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to submit evidence:', errorData.error);
        }
        window.location.href = '/';
    } catch (error) {
        console.error('Error submitting evidence:', error);
        window.location.href = '/';
    }
}

export function hideSendEvidence() {
    const section = document.querySelector('.evidence');
    section.innerHTML = '';
}

async function handleVerification(skillId, approved, userSkillId) {
    const skillTreeName = "electronics";

    try {
        const response = await fetch(`http://localhost:3000/skills/${skillTreeName}/${skillId}/verify`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                userSkillId: userSkillId, approved: approved
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error(errorResponse.error || 'Error verifying evidence');
        }
        window.location.href = '/';

    } catch (error) {
        console.error('Error verifying evidence:', error);
        window.location.href = '/';
    }
}