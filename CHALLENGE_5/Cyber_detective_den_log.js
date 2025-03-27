document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkLogIP() {
        const userAnswer = document.getElementById("log-answer").value.trim();
        const resultElement = document.getElementById("log-result");
        const correctIP = "85.214.132.89";

        if (userAnswer === correctIP) {
            resultElement.textContent = "✅ System Alert: Unauthorized access detected from 85.214.132.89!";
            resultElement.style.color = "#00E6E6";
            resultElement.style.background = "rgba(0, 230, 230, 0.1)";
            resultElement.style.border = "1px solid #00E6E6";
            resultElement.style.boxShadow = "0 0 15px rgba(0, 230, 230, 0.5)";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            resultElement.textContent = "❌ Threat Not Found! Analyze logs again.";
            resultElement.style.color = "#FF3264";
            resultElement.style.background = "rgba(255, 50, 100, 0.1)";
            resultElement.style.border = "1px solid #FF3264";
            resultElement.style.boxShadow = "0 0 15px rgba(255, 50, 100, 0.5)";
        }

        // Add temporary animation
        resultElement.style.animation = "textPop 0.3s ease";
        setTimeout(() => {
            resultElement.style.animation = "";
        }, 300);
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
    document.querySelector("button").addEventListener("click", checkLogIP);

    // Add animation keyframe
    const style = document.createElement('style');
    style.textContent = `
    @keyframes textPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }`;
    document.head.appendChild(style);
});