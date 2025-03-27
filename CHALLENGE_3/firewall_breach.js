document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".draggable");
    const list = document.querySelector("#firewall-rules");
    const userMail = localStorage.getItem("userMail"); // Retrieve user email

    let draggedItem = null;

    // Drag and drop functionality
    items.forEach((item) => {
        item.addEventListener("dragstart", function () {
            draggedItem = this;
            this.classList.add("dragging");
            setTimeout(() => (this.style.display = "none"), 0);
        });

        item.addEventListener("dragend", function () {
            this.classList.remove("dragging");
            setTimeout(() => (this.style.display = "block"), 0);
            draggedItem = null;
        });
    });

    list.addEventListener("dragover", function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });

    // Function to check correct order
    function checkFirewall() {
        const rules = document.querySelectorAll("#firewall-rules li");
        const correctOrder = [
            "BLOCK 0.0.0.0/0 -> 192.168.1.1:22",
            "ALLOW 192.168.1.1:80 -> *:*"
        ];

        let isCorrect = true;
        rules.forEach((rule, index) => {
            if (rule.textContent.trim() !== correctOrder[index]) {
                isCorrect = false;
            }
        });

        const resultText = document.getElementById("firewall-result");
        if (isCorrect) {
            resultText.textContent = "✅ Correct! Firewall secured!";
            resultText.style.color = "limegreen";

            // Update the score on the server
            updateScore(60); // Total score for completing this challenge
        } else {
            resultText.textContent = "❌ Incorrect order! Try again.";
            resultText.style.color = "red";
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
    document.querySelector("button").addEventListener("click", checkFirewall);

    // Helper function to determine the drag position
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }
});