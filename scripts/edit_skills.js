async function createSVGSkills(){
    const response = await fetch('http://localhost:3000/api/data');
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
    text.setAttribute('font-weight','bold');
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


function changeIcon(){
    document.getElementById('icon-upload').addEventListener('change', function () {
        document.getElementById('file-name').textContent = this.files[0]?.name || 'No file selected';
    });
}

function confirmDelete(){
    const deleteButton = document.getElementById('delete');
    const modal = document.getElementById('confirmation-modal');
    const confirmDelete = document.getElementById('confirm-delete');
    const cancelDelete = document.getElementById('cancel-delete');

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('hidden');
    });

    confirmDelete.addEventListener('click', () => {
        const form = deleteButton.closest('form');
        const inputAction = document.createElement('input');
        inputAction.type = 'hidden';
        inputAction.name = 'action';
        inputAction.value = 'delete';
        form.appendChild(inputAction);
        form.submit();
    });

    cancelDelete.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await createSVGSkills();
    confirmDelete();
    changeIcon();

    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    const container = document.querySelector(".details-svg");
    const svgId = container.getAttribute("svgId");
    const item = data.find(item => item.id === svgId);
});