document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkResponse() {
        let selectedOption = document.querySelector('input[name="response"]:checked');
        let resultText = document.getElementById("social-engineering-result");

        if (!selectedOption) {
            resultText.innerHTML = "<span style='color:yellow;'>⚠️ Please select an option!</span>";
            return;
        }

        // Disable all options after first choice
        document.querySelectorAll("input[name='response']").forEach(button => {
            button.disabled = true;
        });

        let answer = selectedOption.value;

        switch (answer) {
            case "verify":
                resultText.innerHTML = "<span style='color:limegreen;'>✅ Correct! You passed the challenge.</span>";

                // Update the score on the server
                updateScore(60); // Total score for completing this challenge
                break;
            case "troll":
                resultText.innerHTML = "<span style='color:orange;'>😂 Not the worst idea, but maybe don’t try this in real life.</span>";
                break;
            case "panic":
                resultText.innerHTML = "<span style='color:red;'>💀 Uh... please don’t destroy your laptop.</span>";
                break;
            case "challenge":
                resultText.innerHTML = "<span style='color:blue;'>🔥 If only hacking duels were a real thing...</span>";
                break;
            default:
                resultText.innerHTML = "<span style='color:red;'>❌ Wrong! Challenge failed. You cannot retry.</span>";
                alert("You lost! Try again.");
                break;
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
    document.querySelector("button").addEventListener("click", checkResponse);
});