document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkPacket() {
        const password = document.getElementById("packet-password").value.toLowerCase();
        const result = document.getElementById("packet-result");

        if (password === "supersecret") {
            result.innerText = "✅ Correct! The password is 'supersecret'.";
            result.style.color = "limegreen";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            result.innerText = "❌ Incorrect. Look for the 'pass' parameter in the packet.";
            result.style.color = "red";
        }
    }

    // Function to update the score on the server
    function updateScore(scoreToAdd) {
        if (!userMail) {
            alert("User email not found. Please log in.");
            return;
        }

        fetch("/update-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mail: userMail, score: scoreToAdd })
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update score.");
                return response.json();
            })
            .then(data => {
                console.log("✅ Score updated successfully:", data);
                alert("🎉 Congratulations! You completed the challenge and earned 60 points!");
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }

    // Attach event listener to the check button
    document.querySelector("button").addEventListener("click", checkPacket);
});