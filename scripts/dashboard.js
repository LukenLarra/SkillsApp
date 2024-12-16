document.addEventListener("DOMContentLoaded", () => {
    const badgesButton = document.querySelector(".mng-badges");
    const usersButton = document.querySelector(".mng-users");

    badgesButton.addEventListener("click", () => {
        window.location.href = "/admin/badges";
    });

    usersButton.addEventListener("click", () => {
        window.location.href = "/admin/users";
    });
});
