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


        backButton.addEventListener("click", function () {
    window.location.href = "dashboard.html";
});
});

// ---- Elements ----
const noteForm = document.getElementById("note-form");
const habitSelect = document.getElementById("habit-select");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");

if (!noteForm || !habitSelect || !noteInput || !notesList) {
    console.warn("Notes: one or more expected elements were not found on this page.");
}


let habits = JSON.parse(localStorage.getItem("habits")) || [];
let notes = JSON.parse(localStorage.getItem("habitNotes")) || [];

function loadHabits() {
    if (!habitSelect) return;
    habitSelect.innerHTML = '<option value="">Select habit</option>';
    habits.forEach((habit, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = habit.name;
        habitSelect.appendChild(option);
    });
}


const noteTemplate = document.getElementById("note-template");

function renderNotes() {
    if (!notesList || !noteTemplate) return;

    notesList.querySelectorAll(".notes-card").forEach(card => card.remove());
    notesList.querySelectorAll(".empty").forEach(el => el.remove());

    if (notes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No notes yet.";
        notesList.appendChild(empty);
        return;
    }

    notes.forEach((note, index) => {
        const clone = noteTemplate.content.cloneNode(true);
        const card = clone.querySelector(".notes-card");
        card.querySelector("h3").textContent = note.habit;
        card.querySelector("p").textContent = note.text;
        card.querySelector(".note-date").textContent = note.date;

        const deleteBtn = card.querySelector(".delete-note");
        deleteBtn.addEventListener("click", () => {
            notes.splice(index, 1);
            localStorage.setItem("habitNotes", JSON.stringify(notes));
            renderNotes();
        });

        notesList.appendChild(clone);
    });
}

// ---- Submit a new note ----
if (noteForm) {
    noteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const habitIndex = habitSelect.value;
        const noteText = noteInput.value.trim();

        if (habitIndex === "") {
            alert("Please select a habit ♡");
            return;
        }
        if (noteText === "") {
            alert("Please type a note ♡");
            return;
        }

        const selectedHabit = habits[Number(habitIndex)];
        if (!selectedHabit) {
            alert("Habit not found.");
            return;
        }

        const newNote = {
            habit: selectedHabit.name,
            text: noteText,
            date: new Date().toLocaleString()
        };

        notes.push(newNote);
        localStorage.setItem("habitNotes", JSON.stringify(notes));

        noteForm.reset();
        renderNotes();
    });
}

// ---- Init ----
loadHabits();
renderNotes();


const themeSelect = document.getElementById('theme-select');
const htmlElement = document.documentElement;


const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
themeSelect.value = savedTheme;

themeSelect.addEventListener('change', (event) => { const selectedTheme = event.target.value;
  htmlElement.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);})