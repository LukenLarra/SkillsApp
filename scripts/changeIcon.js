function changeIcon() {
    const fileInput = document.getElementById('icon-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const iconPreview = document.getElementById('icon-preview');
    const MAX_SIZE = 1024 * 1024;

    fileInput.addEventListener('change', function () {
        const file = this.files[0];

        if (!file) {
            fileNameDisplay.textContent = 'No file selected';
            iconPreview.src = '#';
            iconPreview.classList.add('hidden');
            return;
        }

        if (file.type !== 'image/png') {
            fileNameDisplay.textContent = 'Only PNG files are allowed';
            this.value = '';
            iconPreview.src = '#';
            iconPreview.classList.add('hidden');
            return;
        }

        if (file.size > MAX_SIZE) {
            fileNameDisplay.textContent = 'File size must be less than 1 MB';
            this.value = '';
            iconPreview.src = '#';
            iconPreview.classList.add('hidden');
            return;
        }

        fileNameDisplay.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
            iconPreview.src = e.target.result;
            iconPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

export default changeIcon;