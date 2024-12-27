export function getCurrentUser() {
    let currentUser = document.querySelector('.username') ? document.querySelector('.username').textContent : null;
    return currentUser.split(' ')[1];
}