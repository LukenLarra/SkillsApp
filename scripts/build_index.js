document.addEventListener('DOMContentLoaded', async () => {
    await build_index();
});

export async function build_index() {
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
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

        const textArray = Array.isArray(item.text) ? item.text : item.text.split('\n').map(t => t.trim()).filter(t => t.length > 0);
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

        if (item.unverified_evidences > 0) {
            createEvidenceCanvas(item, 'left', svgWrapper);
        }

        if (item.verified_evidences > 0) {
            createEvidenceCanvas(item, 'right', svgWrapper);
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
            window.location.href = `/skill_details/${item.id}`;
        });

        editIcon.addEventListener('click', async (event) => {
            event.stopPropagation();
            const skillTree = 'electronics';
            window.location.href = `/skills/${skillTree}/edit/${item.id}`;
        });
    });
}

function createEvidenceCanvas(item, type, svgWrapper) {
    const canvas = document.createElement('canvas');
    canvas.classList.add(type === 'left' ? 'ue-canvas' : 've-canvas');
    canvas.width = 30;
    canvas.height = 30;
    canvas.style.position = 'absolute';
    canvas.style.top = '-8px';
    canvas.style[type === 'left' ? 'left' : 'right'] = '0';
    svgWrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(15, 15, 5, 15, 15, 15);
    gradient.addColorStop(0, type === 'left' ? '#e53939' : '#0d9f0f');
    ctx.beginPath();
    ctx.arc(15, 15, 9, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type === 'left' ? item.unverified_evidences : item.verified_evidences, 15, 15);

    if (type === 'right') {
        const hexagon = svgWrapper.querySelector('.hexagon');
        hexagon.style.fill = '#0d9f0f';
    }
}