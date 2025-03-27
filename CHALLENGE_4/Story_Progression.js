document.addEventListener("DOMContentLoaded", function () {
    // Check progress
    const story1Btn = document.getElementById("story1-btn");
    const story2Btn = document.getElementById("story2-btn");

    let progress = JSON.parse(localStorage.getItem("cyber_ctf_progress")) || {};

    // Unlock Story 1 if conditions met
    if (progress.story1_unlocked) {
        story1Btn.classList.remove("locked");
        story1Btn.disabled = false;
        story1Btn.textContent = "📖 Story 1: The Encrypted USB";
        story1Btn.addEventListener("click", () => window.location.href = "Story_Progression_1.html");
    }

    // Unlock Story 2 if Story 1 is completed
    if (progress.story2_unlocked) {
        story2Btn.classList.remove("locked");
        story2Btn.disabled = false;
        story2Btn.textContent = "📖 Story 2: The Suspicious Image";
        story2Btn.addEventListener("click", () => window.location.href = "Story_Progression_2.html");
    }
});
