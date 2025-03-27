document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const profileStatus = document.getElementById("profile-status");
    const dashboardLink = document.getElementById("dashboard-link");
    const authContainer = document.getElementById("auth-container");
    const logoutSection = document.getElementById("logout-section");
    const userNameElement = document.getElementById("user-name");

    function checkSession() {
        fetch("/session", { method: "GET", credentials: "include" })
            .then(response => response.ok ? response.json() : Promise.reject("Session check failed"))
            .then(data => {
                console.log("Session Check:", data);
                if (data.loggedIn) {
                    updateUI(true, data.username);
                    localStorage.setItem("loggedInUser", data.username);
                    localStorage.setItem("userMail", data.mail); // Store email in localStorage
                } else {
                    updateUI(false);
                    localStorage.removeItem("loggedInUser");
                    localStorage.removeItem("userMail"); // Clear email if not logged in
                }
            })
            .catch(error => {
                console.error("Error checking session:", error);
                checkLocalStorage();
            });
    }

    function updateUI(isLoggedIn, username = "") {
        if (isLoggedIn) {
            authContainer?.style.setProperty("display", "none");
            logoutSection?.style.setProperty("display", "block");
            if (userNameElement) userNameElement.textContent = username;
            if (profileStatus) profileStatus.textContent = `Logged in as ${username}`;
            if (dashboardLink) dashboardLink.style.display = "block";
        } else {
            authContainer?.style.setProperty("display", "block");
            logoutSection?.style.setProperty("display", "none");
            if (profileStatus) profileStatus.textContent = "Not Logged In";
            if (dashboardLink) dashboardLink.style.display = "none";
        }
    }

    function checkLocalStorage() {
        const userLoggedIn = localStorage.getItem("loggedInUser");
        updateUI(!!userLoggedIn, userLoggedIn || "");
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const mail = document.getElementById("login-email")?.value;
            const password = document.getElementById("login-password")?.value;
            if (!mail || !password) return alert("Please enter email and password");

            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ mail, password })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Login Response:", data);
                    alert(data.message);
                    if (data.token) {
                        localStorage.setItem("loggedInUser", data.username);
                        localStorage.setItem("userMail", data.mail); // Store email in localStorage
                        checkSession();
                        window.location.href = "dashboard.html";
                    }
                })
                .catch(error => console.error("Login Error:", error));
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            const username = document.getElementById("register-username")?.value;
            const mail = document.getElementById("register-email")?.value;
            const password = document.getElementById("register-password")?.value;
            if (!username || !mail || !password) return alert("Please fill all fields");

            fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, mail, password })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Register Response:", data);
                    alert(data.message);
                    if (data.message === "Registration successful!") {
                        document.getElementById("register-username").value = "";
                        document.getElementById("register-email").value = "";
                        document.getElementById("register-password").value = "";
                    }
                })
                .catch(error => console.error("Register Error:", error));
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("/logout", { method: "POST", credentials: "include" })
                .then(response => response.json())
                .then(data => {
                    console.log("Logout Response:", data);
                    alert(data.message);
                    localStorage.removeItem("loggedInUser");
                    localStorage.removeItem("userMail"); // Clear email on logout
                    updateUI(false);
                    window.location.href = "account.html";
                })
                .catch(error => console.error("Logout Error:", error));
        });
    }

    checkSession();

    if (profileStatus) {
        const userLoggedIn = localStorage.getItem("loggedInUser");
        profileStatus.textContent = userLoggedIn ? `Logged in as ${userLoggedIn}` : "Not Logged In";
    }
});