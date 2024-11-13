import {setDetails, buffer} from "./skills.js";

export async function build_index() {
    const response = await fetch('http://localhost:3000/api/data');
    const data = await response.json();
    const container = document.querySelector(".svg-container");
    data.forEach(item => {
        const svgWrapper = document.createElement('div');
        svgWrapper.classList.add('svg-wrapper');
        svgWrapper.setAttribute('data-id', item.id);
        svgWrapper.setAttribute('data-custom', 'false');
        container.appendChild(svgWrapper);

        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon'); // FontAwesome icon
        editIcon.style.display = 'none';
        svgWrapper.appendChild(editIcon);

        const notebookIcon = document.createElement('i');
        notebookIcon.classList.add('fas', 'fa-book', 'notebook-icon');
        notebookIcon.style.display = 'none';
        svgWrapper.appendChild(notebookIcon);

        svgWrapper.addEventListener('mouseover', () => {
            svgWrapper.classList.add('expanded');
            editIcon.style.display = 'block';
            notebookIcon.style.display = 'block';

            const descriptionDiv = document.querySelector('.description');
            descriptionDiv.textContent = item.description;
            descriptionDiv.style.backgroundColor = '#f1e187';
            descriptionDiv.style.color = 'black';
            descriptionDiv.style.borderTop = '1px solid black';
        });

        svgWrapper.addEventListener('mouseleave', () => {
            svgWrapper.classList.remove('expanded');
            editIcon.style.display = 'none';
            notebookIcon.style.display = 'none';


            const descriptionDiv = document.querySelector('.description');
            descriptionDiv.textContent = '';
            descriptionDiv.style.backgroundColor = '';
            descriptionDiv.style.color = '';
            descriptionDiv.style.borderTop = 'none';

        });


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
        text.setAttribute('font-weight','bold');
        text.setAttribute('style', 'dominant-baseline: middle;');
        item.text.forEach((tspanText, index) => {
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

        notebookIcon.addEventListener('click', async () => {
            await setDetails(svgWrapper);
            const params = new URLSearchParams({
                title: buffer.title,
                score: buffer.score,
                svg: encodeURIComponent(buffer.svg),
                description: buffer.description,
                tasks: JSON.stringify(buffer.tasks),
                resources: JSON.stringify(buffer.resources)
            });

            window.location.href = `/skill_details?${params.toString()}`;
        });
    });
    
}

export async function build_leaderboard() {
    const response = await fetch('http://localhost:3000/api/badges');
    const data = await response.json();
    const table = document.querySelector(".range-table");
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('range-row');
        table.appendChild(tr);

        const td = document.createElement('td');
        td.textContent = item.rango;
        tr.appendChild(td);

        const td2 = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.png;
        td2.appendChild(img);
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.textContent = `${item.bitpoints_min} - ${item.bitpoints_max}`;
        tr.appendChild(td3);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}
