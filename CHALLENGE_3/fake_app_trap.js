document.addEventListener("DOMContentLoaded", function () {
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    function checkFakeApp() {
        let selectedOptions = document.querySelectorAll('input[name="permission"]:checked');
        let resultText = document.getElementById("fake-app-result");

        if (selectedOptions.length === 0) {
            resultText.innerHTML = "<span style='color:yellow;'>⚠️ Please select at least one option!</span>";
            return;
        }

        // Store the correct answers
        let correctAnswers = ["toaster", "refrigerator", "quantum-tunnel"]; // These are fake permissions

        let wrongSelections = [];
        let correctSelections = [];
        selectedOptions.forEach(option => {
            if (correctAnswers.includes(option.value)) {
                correctSelections.push(option.value);
            } else {
                wrongSelections.push(option.value);
            }
        });

        // Disable all checkboxes and button after first attempt
        document.querySelectorAll("input[name='permission']").forEach(box => box.disabled = true);
        document.querySelector("button").disabled = true;

        // Evaluate response
        if (wrongSelections.length === 0 && correctSelections.length > 0) {
            resultText.innerHTML = "<span style='color:limegreen;'>✅ Correct! Toaster, Refrigerator, and Quantum Tunnel are not real permissions.</span>";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            resultText.innerHTML = "<span style='color:red;'>❌ Wrong! Some real permissions can still be risky, but only the weird ones were fake.</span>";
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

    // Attach event listener to the submit button
    document.querySelector("button").addEventListener("click", checkFakeApp);
});