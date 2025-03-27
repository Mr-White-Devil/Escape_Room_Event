// Retrieve existing score from localStorage or initialize to 0
let score = localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0;
document.getElementById("score").textContent = score;
const scoreToAdd = 150; // Always 150, no matter what

// Challenge flag
const correctFlag = "you_are_smart{join_our_department}";

// Generate and download all challenge files
function generateChallengeFiles() {
    generateImageWithHiddenText();
    setTimeout(generateEncryptedTextFile, 1000); // Small delay for smooth processing
    setTimeout(generateHintFile, 2000);
}


// Function to create an image with hidden non-English text
function generateImageWithHiddenText() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 200;

    // Background color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hidden text (first half of the flag) in non-English scripts
    const hiddenText = "你_هو_умный{";  // "you_are_smart{" in Chinese, Arabic, Russian
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(hiddenText, 50, 100);

    // Download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "steganography_challenge.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateEncryptedTextFile() {
    const gibberish = "9asdhjf98as7df7a8sd6f78asd \n";
    const secondHalf = "join_our_department}";

    // Encrypt second half using SHA-256
    sha256(secondHalf).then((hash) => {
        const fileContent = gibberish.repeat(20) + hash + "\n" + gibberish.repeat(20);
        const blob = new Blob([fileContent], { type: "text/plain" });

        // Ensure download works
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "hidden_flag.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up memory
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }).catch(error => {
        console.error("Error generating encrypted text file:", error);
    });
}


// Function to create a hint file with knowledge-related words and SHA-256 hash
function generateHintFile() {
    const words = [
        "wisdom}", "learning}", "knowledge}", "expertise}",
        "understanding}", "skill}", "insight}", "enlightenment}", "cognition}"
    ];

    const hiddenWord = "join_our_department}";
    const sha256Hash = "c4d85c39fb5eaddaa2958a4691963b88f1924f90ba4fec89c9ee1fa43eee008c";

    // Randomly insert the hidden word among the knowledge-related words
    const randomIndex = Math.floor(Math.random() * words.length);
    words.splice(randomIndex, 0, hiddenWord);

    // Append the SHA-256 hash at the bottom as a "hint"
    const fileContent = words.join("\n") + `\n\n# Hash: ${sha256Hash}`;

    // Create a Blob and trigger the download
    const blob = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hint_words.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Simple SHA-256 hashing function
function sha256(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(hash => {
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    });
}

// Function to check the flag submission
function checkFlag() {
    const userFlag = document.getElementById("flag-input").value.trim();
    const userMail = localStorage.getItem("userMail");

    if (!userMail) {
        alert("User email not found. Please log in.");
        return;
    }

    if (userFlag === correctFlag) {
        // Prevent score from stacking if already completed
        if (score < 150) {
            score = 150; // Set to 150 (ensuring it doesn't exceed 150 for this challenge)
            localStorage.setItem("score", score);
            document.getElementById("score").textContent = score;
        }

        document.getElementById("result").textContent = "✅ Correct Answer! Score: " + score;

        // Disable input and button after success
        document.getElementById("flag-input").disabled = true;
        document.getElementById("submit-btn").disabled = true;

        // Send the updated score to the server
        fetch("/update-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mail: userMail, score: score })
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
    } else {
        document.getElementById("result").textContent = "❌ Incorrect flag. Try again!";
    }
}

// Function to reveal the hint
function revealHint() {
    document.getElementById("hint").style.display = "block";
}

// Show the "Next Room" button
document.getElementById("next-room-btn").style.display = "block";
