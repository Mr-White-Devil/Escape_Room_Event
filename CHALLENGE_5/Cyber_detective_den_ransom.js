document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkDecryption() {
        const key = document.getElementById("ransomware-key").value.trim();
        const resultElement = document.getElementById("ransomware-result");
        const correctKey = "CyberDetective2025"; // Correct decryption key

        if (key === correctKey) {
            resultElement.textContent = "✅ Correct! The decrypted message is: FLAG{RansomRescue}";
            resultElement.style.color = "#00E6E6";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            resultElement.textContent = "❌ Incorrect key! Try again.";
            resultElement.style.color = "#FF3264";
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
    document.querySelector("button").addEventListener("click", checkDecryption);
});