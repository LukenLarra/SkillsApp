import changeIcon from "./changeIcon.js";

document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('create');

    createButton.addEventListener('click', async (event) => {
        await addSkill(event);
    });

    changeIcon();
    confirmDelete();
});

async function addSkill(event){
    event.preventDefault();
    const iconUpload = document.getElementById('icon-upload');
    const skillName = document.getElementById('skill-name').value.trim();
    const skillScore = document.getElementById('skill-score').value.trim();
    const description = document.getElementById('edit-skill-description').value.trim();
    const tasks = document.getElementById('task-list').value.trim().split('\n').map(task => task.trim()).filter(task => task !== '');
    const resources = document.getElementById('resource-list').value.trim().split('\n').map(resource => resource.trim()).filter(resource => resource !== '');
    const iconFile = iconUpload.files[0];

    if (!skillName || !skillScore || !description || tasks.length === 0 || resources.length === 0) {
        alert('Please fill in all required fields and add at least one task and one resource.');
        return;
    }

    const formData = new FormData();
    formData.append('text', skillName);
    formData.append('score', skillScore);
    formData.append('description', description);
    formData.append('tasks', JSON.stringify(tasks));
    formData.append('resources', JSON.stringify(resources));
    if (iconFile) {
        formData.append('icon', iconFile);
    }

    try {
        const skillTree = 'electronics';
        const response = await fetch(`/skills/${skillTree}/add`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            const error = await response.json();
            alert(`Failed to add skill: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the skill.');
    }
}

function confirmDelete() {
    const deleteButton = document.getElementById('cancel');
    const modal = document.getElementById('confirmation-modal');
    const confirmExit = document.getElementById('confirm-exit');
    const cancelExit = document.getElementById('cancel-exit');

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.remove('hidden');
    });

    confirmExit.addEventListener('click', () => {
        window.location.href = '/';
    });

    cancelExit.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}
