export async function build_page() {
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
        });

        svgWrapper.addEventListener('mouseleave', () => {
            svgWrapper.classList.remove('expanded');
            editIcon.style.display = 'none';
            notebookIcon.style.display = 'none';
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
    });

    notebookIcon.addEventListener('click', () => {
        showSkillDetails(item);
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

export function showSkillDetails(skill) {
    // Selecciona el contenedor donde se mostrarán los detalles de la competencia
    const detailsContainer = document.querySelector('#skill-details');
    detailsContainer.style.display = 'block'; // Asegúrate de que sea visible

    // Genera el contenido HTML para los detalles
    detailsContainer.innerHTML = `
        <h2>${skill.text.join(' ')}</h2>
        <p>${skill.description}</p>
        <img src="${skill.icon}" alt="${skill.text}" class="skill-icon" />
        
        <h3>Tareas</h3>
        <ul class="tasks-list">
            ${skill.tasks.map(task => `<li><input type="checkbox" class="task-checkbox" /> ${task}</li>`).join('')}
        </ul>
        
        <h3>Recursos</h3>
        <ul class="resources-list">
            ${skill.resources.map(resource => `<li><a href="${resource}" target="_blank">${resource}</a></li>`).join('')}
        </ul>
        
        <div class="evidence-form" style="display: none;">
            <h3>Submit Evidence</h3>
            <label for="evidence-url">URL de la evidencia:</label>
            <input type="url" id="evidence-url" placeholder="https://example.com/mi-evidencia" required />
            <button id="submit-evidence">Submit Evidence</button>
        </div>
    `;

    // Configuración de eventos para checkboxes y envío de evidencia (opcional)
    const checkboxes = detailsContainer.querySelectorAll('.task-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                triggerConfetti();
                detailsContainer.querySelector('.evidence-form').style.display = 'block';
            }
        });
    });

    const submitButton = detailsContainer.querySelector('#submit-evidence');
    submitButton.addEventListener('click', () => {
        const evidenceUrl = document.getElementById('evidence-url').value;
        if (evidenceUrl) {
            alert('Evidencia enviada: ' + evidenceUrl);
            detailsContainer.style.display = 'none'; // Oculta el modal
        } else {
            alert('Por favor, ingresa una URL válida.');
        }
    });
}
