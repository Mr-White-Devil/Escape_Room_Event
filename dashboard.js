document.addEventListener("DOMContentLoaded", function () {
    const playerName = document.getElementById("player-name");
    const playerScore = document.getElementById("player-score");

    // Get logged-in user
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        window.location.href = "account.html"; // Redirect if not logged in
    }

    const userData = JSON.parse(localStorage.getItem(loggedInUser));
    playerName.textContent = userData.username;
    playerScore.textContent = localStorage.getItem(loggedInUser + "_score") || 0;
});
