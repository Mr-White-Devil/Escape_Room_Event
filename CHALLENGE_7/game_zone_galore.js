document.addEventListener("DOMContentLoaded", function () {
    const quizData = [
        { question: "I come from the East, but I'm played worldwide, With tiles and strategy side by side.", answer: "Mahjong" },
        { question: "What is the name of the in-game social media platform in GTA V?", answer: "Lifeinvader" },
        { question: "In Super Mario Galaxy, what is the name of the princess who watches over the Lumas?", answer: "Rosalina" },
        { question: "What is the most popular car in the Need for Speed franchise?", answer: "BMW M3 GTR" },
        { question: "One of the Choosers of the Slain, Queen of the Eight, and guide of fallen warriors to Valhalla.", answer: "Sigrun" },
        { question: "The prized possession of the Alpha and the Omega, a weapon with the power to cut through dimensions", answer: "Yamato" },
        { question: "The guardian of the timeline, with horns shaped like the infinity symbol, signifying its eternal existence", answer: "Dahaka" },
        { question: "Before launching on mobile, this game started as a Facebook game in 2012. Its success led to mobile versions.", answer: "Candy Crush" },
        { question: "What term refers to a warrior consumed by bloodlust, losing all humanity, and becoming a demon of slaughter in the 2019 Game of the Year?", answer: "Shura" },
        { question: "I'm not a fruit, but I appear, Hit me once, and you'll shed a tear. Explode too many, and it's the end, So dodge me fast, my ninja friend.", answer: "Bomb" }
    ];

    const quizContainer = document.getElementById("quiz-container");
    const userMail = localStorage.getItem("userMail"); // Retrieve user email
    let totalScore = 0; // Track total score for this challenge
    let answeredQuestions = new Set(); // Store indexes of answered questions

    // Calculate points per question
    const pointsPerQuestion = 200 / quizData.length; // 20 points per question

    // Render quiz questions
    quizData.forEach((item, index) => {
        let questionBlock = document.createElement("div");
        questionBlock.classList.add("question-block");
        questionBlock.innerHTML = `
            <p><strong>Q${index + 1}:</strong> ${item.question}</p>
            <input type="text" id="answer-${index}" placeholder="Your Answer" class="answer-input">
            <button class="submit-btn" id="submit-${index}">Submit</button>
            <p class="status" id="status-${index}"></p>
        `;
        quizContainer.appendChild(questionBlock);

        // Add event listener for submit button
        document.getElementById(`submit-${index}`).addEventListener("click", function () {
            let userAnswer = document.getElementById(`answer-${index}`).value.trim();
            let statusElement = document.getElementById(`status-${index}`);
            let inputField = document.getElementById(`answer-${index}`);
            let submitButton = document.getElementById(`submit-${index}`);

            if (!answeredQuestions.has(index)) {
                if (userAnswer.toLowerCase() === item.answer.toLowerCase()) {
                    // Add points for correct answer
                    totalScore += pointsPerQuestion;
                    answeredQuestions.add(index);

                    // Update UI
                    statusElement.innerHTML = "✅ Correct!";
                    statusElement.style.color = "green";
                    inputField.disabled = true;
                    submitButton.disabled = true;

                    // Update score display
                    updateScoreDisplay();

                    // If all questions are answered, update the score on the server
                    if (answeredQuestions.size === quizData.length) {
                        updateScore(totalScore);
                    }
                } else {
                    statusElement.innerHTML = "❌ Incorrect! Try again.";
                    statusElement.style.color = "red";
                }
            }
        });
    });

    // Function to update the score display
    function updateScoreDisplay() {
        document.getElementById("result").innerHTML = `<h2>You scored ${Math.round(totalScore)} / 200!</h2>`;

        if (answeredQuestions.size === quizData.length) {
            document.getElementById("result").innerHTML += `<p>🎉 Quiz Completed! 🎉</p>`;
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
                alert("🎉 Congratulations! You completed the quiz and earned 200 points!");
            })
            .catch(error => {
                console.error("❌ Error updating score:", error);
                alert("Failed to update score. Check the console for details.");
            });
    }
});