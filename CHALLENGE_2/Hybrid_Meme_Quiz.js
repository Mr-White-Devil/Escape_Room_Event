document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 0;
    let username = localStorage.getItem("username") || "Player";
    let userMail = localStorage.getItem("userMail"); // Retrieve user email
    let score = 0;

    const questions = [
        { question: "The Lost Search Engine", answer: "doge", hint: "The last remaining meme of the old internet.", meme: "doge.jpeg" },
        { question: "The CAPTCHA Loop", answer: "I am not a robot", hint: "The most annoying phrase before entering websites.", meme: "captcha.jpeg" },
        { question: "Decrypt the Hacker Code", answer: "password123", hint: "The world's most insecure password.", meme: "password.jpeg" },
        { question: "The Ultimate Meme Question", answer: "Rick Astley", hint: "The king of internet pranks.", meme: "rick.jpg" }
    ];

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            // Quiz completed
            document.getElementById("quiz-container").innerHTML = `
                <h2>🎉 You Completed the Quiz! 🎉</h2>
                <p>Your final score: ${score}</p>
            `;

            // Update the score on the server
            updateScore(150); // Total score for completing all questions

            // Show the Next Room button
            document.getElementById("next-room-btn").style.display = "block";

            return;
        }

        const q = questions[currentQuestionIndex];
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question-block");
        questionDiv.innerHTML = `
            <p class="quiz-question">${q.question}</p>
            <input type="text" class="cyber-input answer-input" placeholder="Enter your answer...">
            <button class="cyber-button submit-btn">Submit</button>
            <div class="hint-section">
                <p class="hint-text" style="display: none;">${q.hint}</p>
                <button class="cyber-button hint-btn">Reveal Hint</button>
            </div>
            <div class="meme-container">
                <img class="meme-img" src="${q.meme}" alt="Meme Hint" style="display: none;">
            </div>
        `;

        document.getElementById("quiz-container").appendChild(questionDiv);

        // Handle answer submission
        questionDiv.querySelector(".submit-btn").addEventListener("click", function () {
            const userAnswer = questionDiv.querySelector(".answer-input").value.trim().toLowerCase();
            if (userAnswer === q.answer.toLowerCase()) {
                score += 10; // Increment score for each correct answer
                questionDiv.remove(); // Remove the current question
                currentQuestionIndex++; // Move to the next question
                loadQuestion(); // Load the next question
            } else {
                alert("❌ Incorrect! Try again.");
            }
        });

        // Handle hint reveal
        questionDiv.querySelector(".hint-btn").addEventListener("click", function () {
            questionDiv.querySelector(".hint-text").style.display = "block";
            questionDiv.querySelector(".meme-img").style.display = "block";
        });
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
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }

    // Load the first question
    loadQuestion();
});