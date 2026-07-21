if (localStorage.getItem("adminToken")) {
    window.location.href = "dashboard.html";
}

async function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("loginError");

    error.innerText = "";

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("adminToken", data.token);

            window.location.href = "dashboard.html";

        } else {

            error.innerText = data.message;
            error.style.color = "red";

        }

    } catch (err) {

        error.innerText = "Unable to connect to server.";
        error.style.color = "red";

    }
}
