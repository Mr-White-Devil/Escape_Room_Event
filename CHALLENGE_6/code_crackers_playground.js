document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email
    let totalScore = 0; // Track total score for this challenge
    const correctAnswers = new Set(); // Track which answers have been correctly submitted

    // Function to check answers
    function checkAnswer(type) {
        let userAnswer;
        let correctAnswer;
        let feedbackElement;

        if (type === "binary") {
            userAnswer = document.getElementById("binary-answer").value.trim().toLowerCase();
            correctAnswer = "hi";
            feedbackElement = document.getElementById("binary-feedback");
        } else if (type === "lang") {
            userAnswer = document.getElementById("lang-answer").value.trim().toLowerCase();
            correctAnswer = "python";
            feedbackElement = document.getElementById("lang-feedback");
        } else if (type === "sequence") {
            userAnswer = document.getElementById("sequence-answer").value.trim();
            correctAnswer = "30";
            feedbackElement = document.getElementById("sequence-feedback");
        } else if (type === "reverse") {
            userAnswer = document.getElementById("reverse-answer").value.trim().toLowerCase();
            correctAnswer = "i love python programming";
            feedbackElement = document.getElementById("reverse-feedback");
        } else if (type === "hash") {
            userAnswer = document.getElementById("hash-answer").value.trim().toLowerCase();
            correctAnswer = "sha256";
            feedbackElement = document.getElementById("hash-feedback");
        }

        // Check if the answer is correct and hasn't been submitted before
        if (userAnswer === correctAnswer && !correctAnswers.has(type)) {
            feedbackElement.innerHTML = "✅ Correct!";
            feedbackElement.style.color = "lightgreen";

            // Add points for each correct answer
            totalScore += 50; // Each correct answer gives 50 points
            correctAnswers.add(type); // Mark this answer as correctly submitted
            console.log(`Current Score: ${totalScore}`);

            // If all answers are correct, update the total score on the server
            if (totalScore === 250) {
                updateScore(totalScore);
            }
        } else if (userAnswer !== correctAnswer) {
            feedbackElement.innerHTML = "❌ Try Again!";
            feedbackElement.style.color = "red";
        } else {
            feedbackElement.innerHTML = "⚠️ Already submitted!";
            feedbackElement.style.color = "yellow";
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
                alert("🎉 Congratulations! You completed the challenge and earned 250 points!");
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }

    // Attach event listeners to all submit buttons
    document.getElementById("binary-submit").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        checkAnswer("binary");
    });
    document.getElementById("lang-submit").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        checkAnswer("lang");
    });
    document.getElementById("sequence-submit").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        checkAnswer("sequence");
    });
    document.getElementById("reverse-submit").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        checkAnswer("reverse");
    });
    document.getElementById("hash-submit").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        checkAnswer("hash");
    });
});