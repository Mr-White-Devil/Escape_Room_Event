document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkPassword() {
        const userGuess = document.getElementById("password-guess").value.trim();
        const resultDisplay = document.getElementById("password-result");

        const correctPassword = "password";  // This MD5 hash is for "password"
        const misleadingPasswords = ["password1", "passw0rd", "password123", "password!"];

        if (userGuess === "") {
            resultDisplay.innerHTML = "⚠️ Enter a password!";
            resultDisplay.style.color = "#FFFF00"; /* Yellow warning */
            return;
        }

        if (userGuess.toLowerCase() === correctPassword) {
            resultDisplay.innerHTML = "✅ Correct! You cracked the password!";
            resultDisplay.style.color = "#00FF00"; /* Green success */

            // Update the score on the server
            updateScore(90); // Total score for completing this challenge
        } else if (misleadingPasswords.includes(userGuess.toLowerCase())) {
            resultDisplay.innerHTML = "⚠️ Close, but not quite!";
            resultDisplay.style.color = "orange";
        } else {
            resultDisplay.innerHTML = "❌ Wrong! Try again.";
            resultDisplay.style.color = "red";
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
                alert("🎉 Congratulations! You completed the challenge and earned 90 points!");
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }

    // Attach event listener to the check button
    document.querySelector("button").addEventListener("click", checkPassword);
});