document.addEventListener('DOMContentLoaded', async () => {
    await build_leaderboard();
});

async function build_leaderboard() {
    const response = await fetch('http://localhost:3000/api/badges');
    const data = await response.json();


    data.forEach(item => {

    });
}
