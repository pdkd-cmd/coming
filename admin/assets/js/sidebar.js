function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
}

document.querySelectorAll(".sidebar a").forEach(link => {
    if (link.pathname === window.location.pathname) {
        link.classList.add("active-link");
    }
});