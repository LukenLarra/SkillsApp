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