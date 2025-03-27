document.addEventListener("DOMContentLoaded", function () {
    const answerInput = document.getElementById("answer2");
    const submitButton = document.getElementById("submit2");
    const resultDisplay = document.getElementById("result2");
    const downloadButton = document.getElementById("downloadMessage");
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    // Handle quiz answer
    submitButton.addEventListener("click", function () {
        const userAnswer = answerInput.value.trim().toLowerCase();

        if (userAnswer === "base64 -d") {
            resultDisplay.innerHTML = "✅ Correct! The message is decrypted.";
            resultDisplay.style.color = "lightgreen";

            // Update the score on the server
            updateScore(175); // Total score for completing this challenge
        } else {
            resultDisplay.innerHTML = "❌ Incorrect! Try again.";
            resultDisplay.style.color = "red";
        }
    });

    // Handle hidden message download
    downloadButton.addEventListener("click", function () {
        const hiddenMessage = "SGVsbG8sIFlvdSBGb3VuZCBUaGUgU2VjcmV0IQ=="; // Base64 for "Hello, You Found The Secret!"
        const blob = new Blob([hiddenMessage], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Hidden_Message.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Redirect to the next challenge
    document.getElementById("nextChallenge").addEventListener("click", function () {
        window.location.href = "cyber_detectives_den.html"; // Redirects to the next challenge
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