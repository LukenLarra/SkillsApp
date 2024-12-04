document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".registerForm");
    form.addEventListener('submit', (event) => {
        if (checkPassword()){
            form.submit();
        }else{
            event.preventDefault();
        }
    });

    //Validar tambien que el nombre de usuario debe de ser unico


});

function checkPassword() {

    const password = document.getElementById('password').value;
    const passwordConf = document.getElementById('password_conf').value;

    if (password !== passwordConf) {
        alert('Passwords do not match.');
        return false;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }
    return true;
}