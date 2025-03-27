document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-challenge");
    const endButton = document.getElementById("end-challenge");
    const timerDisplay = document.getElementById("timer-display");

    let startTime = localStorage.getItem("startTime") ? parseInt(localStorage.getItem("startTime")) : null;
    let timerInterval;

    function startTimer() {
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem("startTime", startTime);
        }
        updateTimerDisplay();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }

    function updateTimerDisplay() {
        if (!startTime) {
            timerDisplay.textContent = "⏳ Timer: 00:00";
            return;
        }
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        timerDisplay.textContent = `⏳ Timer: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function stopTimer() {
        if (!startTime) return;
        clearInterval(timerInterval);

        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const userMail = localStorage.getItem("userMail");

        if (!userMail) {
            alert("User email not found. Please log in.");
            return;
        }

        console.log("Updating time for:", userMail, "Time:", formattedTime);

        // Send time to server
        fetch("/update-time", { // Use a new endpoint for updating time
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mail: userMail,
                time: formattedTime
            })
        }).then(response => {
            if (!response.ok) throw new Error("Failed to update time.");
            return response.json();
        }).then(data => {
            console.log("✅ Time Updated:", data);
        }).catch(error => console.error("❌ Error updating time:", error));

        // Reset timer
        localStorage.removeItem("startTime");
        startTime = null;
        clearInterval(timerInterval); // Ensure interval is cleared
        timerDisplay.textContent = "⏳ Timer: 00:00";
    }

    // Attach event listeners
    if (startButton) startButton.addEventListener("click", startTimer);
    if (endButton) endButton.addEventListener("click", stopTimer);

    // Resume timer if already started
    if (startTime) {
        updateTimerDisplay();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }

    // Expose functions globally for onclick in HTML
    window.startTimer = startTimer;
    window.stopTimer = stopTimer;
});
