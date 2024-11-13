
document.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                triggerConfetti();
                showEvidenceOption();
            }
        });
    });
});

function triggerConfetti() {
    confetti({
        particleCount: 500,
        spread: 160,
        origin: { y: 0.8 }
    });
}

function showEvidenceOption(){
    const section = document.querySelector('.evidence');
    const h2 = document.createElement('h2');
    h2.textContent = 'Provide Evidence';
    h2.classList.add('evidence-title');

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter a URL or explanation as evidence for completing this skill";
    textarea.classList.add('evidence-textarea');

    const button = document.createElement('button');
    button.textContent = 'Submit Evidence';
    button.type = 'submit';
    button.classList.add('evidence-submit');

    section.appendChild(h2);
    section.appendChild(textarea);
    section.appendChild(button);
}
