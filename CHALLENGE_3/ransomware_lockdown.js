document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkRansomware() {
        let userInput = document.getElementById("ransomware-key").value.trim();
        let resultText = document.getElementById("ransomware-result");

        // Disable input & button after selection
        document.getElementById("ransomware-key").disabled = true;
        document.querySelector("button").disabled = true;

        if (userInput === "45?63") {
            resultText.innerHTML = "<span style='color: limegreen;'>✅ Correct! Decryption key accepted.</span>";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            resultText.innerHTML = "<span style='color: red;'>❌ Incorrect! Hint: Add up the digits except 'A'!</span>";
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
    document.querySelector("button").addEventListener("click", checkRansomware);
});