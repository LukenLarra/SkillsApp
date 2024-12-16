document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('create');
    const cancelButton = document.getElementById('cancel');
    const iconUpload = document.getElementById('icon-upload');

    // Handle Cancel Button
    cancelButton.addEventListener('click', (event) => {
        event.preventDefault();
        const confirmed = confirm('Are you sure you want to cancel? Changes will not be saved.');
        if (confirmed) {
            window.location.href = '/'; // Replace with the route to your main page
        }
    });

    // Handle Create Button
    createButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Collect form data
        const skillName = document.getElementById('skill-name').value.trim();
        const skillScore = document.getElementById('skill-score').value.trim();
        const description = document.getElementById('edit-skill-description').value.trim();
        const tasks = document.getElementById('task-list').value.trim().split('\n').map(task => task.trim()).filter(task => task !== '');
        const resources = document.getElementById('resource-list').value.trim().split('\n').map(resource => resource.trim()).filter(resource => resource !== '');
        const iconFile = iconUpload.files[0];

        // Validate fields
        if (!skillName || !skillScore || !description || tasks.length === 0 || resources.length === 0) {
            alert('Please fill in all required fields and add at least one task and one resource.');
            return;
        }

        // Create form data for submission
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
            // Send the data to the server
            const skillTree = 'electronics';
            const response = await fetch(`/skills/${skillTree}/add`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Skill added successfully!');
                window.location.href = '/'; // Redirect to the main page
            } else {
                const error = await response.json();
                alert(`Failed to add skill: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the skill.');
        }
    });
});
