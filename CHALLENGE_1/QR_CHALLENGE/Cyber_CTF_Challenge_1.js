// Retrieve existing score from localStorage or initialize to 0
let score = localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0;
document.getElementById("score").textContent = score;
const scoreToAdd = 150; // Always 150, no matter what

// Challenge flag
const correctFlag = "cybersecurity{gethu}";

// Function to get user email from cookies
function getUserMailFromCookies() {
    return document.cookie.split('; ').find(row => row.startsWith('userMail='))?.split('=')[1];
}

// Retrieve user email
const userMail = localStorage.getItem("userMail") || getUserMailFromCookies();

// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Generate the QR Code with the constant flag
    new QRCode(document.getElementById("qrcode"), {
        text: correctFlag,
        width: 200,
        height: 200
    });

    console.log("✅ QR Code Loaded with Flag:", correctFlag);

    // Attach event listener to submit button
    document.getElementById("submit-button").addEventListener("click", checkFlag);
});

// Function to check flag submission
function checkFlag() {
    const userInput = document.getElementById("qr-input").value.trim();
    const resultDisplay = document.getElementById("qr-result");
    const submitButton = document.getElementById("submit-button");

    if (!userMail) {
        alert("User email not found. Please log in.");
        return;
    }

    // Ensure the user has not completed the challenge before
    const challengeKey = "challenge_" + correctFlag;
    if (localStorage.getItem(challengeKey)) {
        resultDisplay.textContent = "⚠️ Challenge already completed!";
        resultDisplay.style.color = "yellow";
        return;
    }

    console.log("User Input:", JSON.stringify(userInput));
    console.log("Correct Flag:", JSON.stringify(correctFlag));
    console.log("Match Result:", userInput === correctFlag);

    if (userInput === correctFlag) {
        // Prevent score from stacking if already completed
        if (score < 150) {
            score += scoreToAdd; // Add 150 to the current score
            localStorage.setItem("score", score);
            document.getElementById("score").textContent = score;
        }

        resultDisplay.textContent = "✅ Correct Answer! Score: " + score;
        resultDisplay.style.color = "limegreen";

        submitButton.disabled = true;
        submitButton.style.opacity = "0.5";

        // Mark challenge as completed
        localStorage.setItem(challengeKey, "true");

        // Send the updated score to the server
        updateScore(userMail, score);
    } else {
        resultDisplay.textContent = "❌ Incorrect Answer. Try Again!";
        resultDisplay.style.color = "red";
    }
}

// Function to update score on server
function updateScore(userMail, newScore) {
    console.log("Sending score update:", { mail: userMail, score: newScore });

    fetch('/update-score', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: userMail, score: newScore }) // Send the updated score
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