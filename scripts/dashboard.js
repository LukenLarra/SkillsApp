document.addEventListener("DOMContentLoaded", () => {
    const badgesButton = document.querySelector(".mng-badges");
    const usersButton = document.querySelector(".mng-users");

    badgesButton.addEventListener("click", () => {
        fetch("/admin/badges").catch(error => {
            console.error("Error fetching badges:", error);
        });
    });

    usersButton.addEventListener("click", () => {
        fetch("/admin/users").catch(error => {
            console.error("Error fetching users:", error);
        });
    });
});
