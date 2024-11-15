export let buffer = {
    title: '',
    score: '',
    svg: '',
    description: '',
    tasks: [],
    resources: []
};

export async function buildSkills(wrapper){
    const id = wrapper.getAttribute('data-id');
    const response =  await fetch(`http://localhost:3000/api/data`)
    const data = await response.json();
    const element = data.find(item => item.id === id);
    const skillHeader = document.createElement('section');
    skillHeader.id = 'skill-header';

    const skillTitle = document.createElement('article');
    skillTitle.className = 'skill-title';
    const titleH1 = document.createElement('h1');
    titleH1.textContent = `Skill: ${element.text.toString()}`;
    skillTitle.appendChild(titleH1);

    const skillScore = document.createElement('article');
    skillScore.className = 'skill-score';
    const scoreH2 = document.createElement('h2');
    scoreH2.textContent = `Skill Score: ${element.points}`;
    skillScore.appendChild(scoreH2);

    skillHeader.appendChild(skillTitle);
    skillHeader.appendChild(skillScore);

    const skillVisualization = document.createElement('section');
    skillVisualization.id = 'skill-visualization';
    const detailsSvg = document.createElement('div');
    detailsSvg.className = 'details-svg';
    detailsSvg.innerHTML = wrapper.outerHTML;
    skillVisualization.appendChild(detailsSvg);

    const skillDescription = document.createElement('section');
    skillDescription.id = 'skill-description';
    const descriptionH2 = document.createElement('h2');
    descriptionH2.textContent = 'Description';
    const descriptionContent = document.createElement('article');
    descriptionContent.className = 'description-content';
    const descriptionP = document.createElement('p');
    descriptionP.className = 'description-skill';
    descriptionP.textContent = element.description;
    descriptionContent.appendChild(descriptionP);
    skillDescription.appendChild(descriptionH2);
    skillDescription.appendChild(descriptionContent);

    const tasksToComplete = document.createElement('section');
    tasksToComplete.id = 'tasks-to-complete';
    const tasksH2 = document.createElement('h2');
    tasksH2.textContent = 'Task To Complete';
    const taskList = document.createElement('article');
    taskList.className = 'task-list';
    const tasksUl = document.createElement('ul');
    tasksUl.className = 'tasks';
    element.tasks.forEach(task => {
        const taskLi = document.createElement('li');
        const taskLabel = document.createElement('label');
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.className = 'task-checkbox';
        taskLabel.appendChild(taskCheckbox);
        taskLabel.appendChild(document.createTextNode(` ${task}`));
        taskLi.appendChild(taskLabel);
        tasksUl.appendChild(taskLi);
    });
    taskList.appendChild(tasksUl);
    tasksToComplete.appendChild(tasksH2);
    tasksToComplete.appendChild(taskList);

    const resourcesSection = document.createElement('section');
    resourcesSection.id = 'resources';
    const resourcesH2 = document.createElement('h2');
    resourcesH2.textContent = 'Resources';
    const resourceList = document.createElement('article');
    resourceList.className = 'resource-list';
    const resourcesUl = document.createElement('ul');
    resourcesUl.className = 'resources';
    element.resources.forEach(resource => {
        const resourceLi = document.createElement('li');
        resourceLi.textContent = resource.toString();
        resourcesUl.appendChild(resourceLi);
    });
    resourceList.appendChild(resourcesUl);
    resourcesSection.appendChild(resourcesH2);
    resourcesSection.appendChild(resourceList);

    window.location.href = 'http://localhost:3000/skill_details';

    window.addEventListener('load', () => {
        document.body.appendChild(skillHeader);
        document.body.appendChild(skillVisualization);
        document.body.appendChild(skillDescription);
        document.body.appendChild(tasksToComplete);
        document.body.appendChild(resourcesSection);
    });
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