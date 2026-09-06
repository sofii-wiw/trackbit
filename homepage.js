document.addEventListener("DOMContentLoaded", () => {

    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    const today = new Date().toISOString().split("T")[0];

    // Overview
    document.getElementById("total-habits").textContent = habits.length;

    document.getElementById("completed-habits").textContent =
        habits.filter(h => h.completed && h.lastUpdated === today).length;

    const longest = Math.max(
        ...habits.map(h => Number(h.longestStreak) || 0),
        0
    );

    document.getElementById("longest-streak").textContent =
        `${longest} days`;

    // Analytics
    const analytics = document.querySelector(".analytics-card");

    if (!habits.length) {
        analytics.innerHTML = "<p>No habits yet.</p>";
        return;
    }

    const categories = [...new Set(habits.map(h => h.category))];

    analytics.innerHTML = "";

    categories.forEach(category => {

        const total = habits.filter(
            h => h.category.toLowerCase() === category.toLowerCase()
        ).length;

        const completed = habits.filter(
            h => h.category.toLowerCase() === category.toLowerCase() &&
                 h.completed
        ).length;

        const percent = Math.round((completed / total) * 100);
        const card = document.createElement("div");
        card.innerHTML = `<h3>${category}</h3>
            <p>Completed: ${completed} / ${total}</p>
            <div class="analytics-progress">
                <div class="analytics-progress-bar"
                     style="width:${percent}%"></div>
            </div>
            <p>${percent}% completed</p>`;
        analytics.appendChild(card);});
});
