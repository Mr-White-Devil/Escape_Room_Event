document.addEventListener("DOMContentLoaded", function () {
    const answerInput = document.getElementById("answer1");
    const submitButton = document.getElementById("submit1");
    const resultDisplay = document.getElementById("result1");
    const downloadButton = document.getElementById("downloadFile");
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    // Handle quiz answer
    submitButton.addEventListener("click", function () {
        const userAnswer = answerInput.value.trim().toLowerCase();

        if (userAnswer === "bcrypt") {
            resultDisplay.innerHTML = "✅ Correct! The USB decryption has started.";
            resultDisplay.style.color = "lightgreen";

            // Update the score on the server
            updateScore(175); // Total score for completing this challenge
        } else {
            resultDisplay.innerHTML = "❌ Incorrect! Try again.";
            resultDisplay.style.color = "red";
        }
    });

    // Handle file download
    downloadButton.addEventListener("click", function () {
        const fileContent = "USB Investigation Log:\nSuspicious file found: 'Hidden_Message.txt'\nPossible encryption detected.";
        const blob = new Blob([fileContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "USB_Report.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Redirect to the next story
    document.getElementById("nextStory").addEventListener("click", function () {
        window.location.href = "Story_Progression_2.html"; // Redirects to Story 2
    });

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
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }
});