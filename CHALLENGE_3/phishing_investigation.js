document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkPhishing() {
        const selectedFlags = new Set(
            [...document.querySelectorAll('input[name="flag"]:checked')].map(input => input.value)
        );

        const correctFlags = new Set(["fake-domain", "urgent-language", "suspicious-link"]);

        // Compare selections with correct answers
        if (selectedFlags.size === correctFlags.size && [...selectedFlags].every(flag => correctFlags.has(flag))) {
            document.getElementById("phishing-result").textContent = "✅ Correct! This is a phishing email.";
            document.getElementById("phishing-result").style.color = "#00FF00";

            // Unlock next challenge
            document.querySelector(".challenge").classList.add("unlocked");

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            document.getElementById("phishing-result").textContent = "❌ Incorrect! Look carefully at the email details.";
            document.getElementById("phishing-result").style.color = "#FF3264";
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
    document.querySelector("button").addEventListener("click", checkPhishing);
});