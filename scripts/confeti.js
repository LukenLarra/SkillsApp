
document.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                triggerConfetti();
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
