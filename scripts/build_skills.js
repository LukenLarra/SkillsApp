export let buffer = {
    title: '',
    score: '',
    svg: '',
    description: '',
    tasks: [],
    resources: []
};

export async function buildSkills(wrapper){
    await setDetails(wrapper);
    const params = new URLSearchParams({
        title: buffer.title,
        score: buffer.score,
        svg: encodeURIComponent(buffer.svg),
        description: buffer.description,
        tasks: JSON.stringify(buffer.tasks),
        resources: JSON.stringify(buffer.resources),
    });

    window.location.href = `/skill_details?${params.toString()}`;
}

export function getDetails() {
    return {
        title: buffer.title,
        score: buffer.score,
        svg: buffer.svg,
        description: buffer.description,
        tasks: buffer.tasks,
        resources: buffer.resources
    };

}

async function setDetails(element){
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    await Promise.all(data.map(async (item) => {
        buffer.resources = item.resources;
        buffer.tasks = item.tasks;
        buffer.description = item.description;
        buffer.score = item.points;
        buffer.title = element.querySelector('text').textContent;
        buffer.svg = element.outerHTML;
    }));
}

export function createEvidenceTable() {
    const section = document.querySelector(".evidence-submission");

    const heading = document.createElement('h2');
    heading.textContent = 'Unverified Evidence Submissions';

    const table = document.createElement('table');
    table.border = '1';

    const headerRow = document.createElement('tr');
    const headers = ['User', 'Evidence', 'Actions'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const dataRow = document.createElement('tr');
    const data = ['Dato 1', 'Dato 2'];
    data.forEach(item => {
        const td = document.createElement('td');
        td.textContent = item;
        dataRow.appendChild(td);
    });
    const actionTd = document.createElement('td');

    const approveButton = document.createElement('button');
    approveButton.textContent = 'Approve';
    approveButton.style.backgroundColor = 'green';
    approveButton.style.color = 'white';
    approveButton.style.marginRight = '5px';

    const rejectButton = document.createElement('button');
    rejectButton.textContent = 'Reject';
    rejectButton.style.backgroundColor = 'red';
    rejectButton.style.color = 'white';

    actionTd.appendChild(approveButton);
    actionTd.appendChild(rejectButton);
    dataRow.appendChild(actionTd);
    table.appendChild(dataRow);

    section.appendChild(heading);
    section.appendChild(table);

}