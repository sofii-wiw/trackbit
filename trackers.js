
const habitForm = document.getElementById("habit-form");
const habitNameInput = document.getElementById("habit-name");
const habitCategorySelect = document.getElementById("habit-category");
const habitFrequencySelect = document.getElementById("habit-frequency");
const habitList = document.getElementById("habit-list");
const editHabitForm = document.getElementById("edit-habit-form");
const editHabitNameInput = document.getElementById("edit-habit-name");
const editHabitCategorySelect = document.getElementById("edit-habit-category");
const editHabitFrequencySelect = document.getElementById("edit-habit-frequency");
const editHabitSection = document.getElementById("edit-habit");
const cancelEditBtn = document.getElementById("cancel-edit");
const categoryForm = document.getElementById("category-form");
const newCategoryInput = document.getElementById("new-category");
const categoryList = document.getElementById("category-list");
const reminderForm = document.getElementById("reminder-form");
const reminderHabitSelect = document.getElementById("reminder-habit");
const reminderTimeInput = document.getElementById("reminder-time");
const reminderFrequencySelect = document.getElementById("reminder-frequency");
const reminderList = document.getElementById("reminder-list");
const filterCategorySelect = document.getElementById("filter-category");
const clearDataBtn = document.getElementById("clear-data");
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let categories =
    JSON.parse(localStorage.getItem("categories")) ||
    ["health", "productivity", "learning"];
let reminders =
    JSON.parse(localStorage.getItem("reminders")) || [];
let habitToEdit = null;



document.addEventListener("DOMContentLoaded", () => {
    renderHabits();
    renderCategories();
    renderReminders();
    updateCategoryOptions();
    updateFilterOptions();
    updateReminderOptions();
    updateOverview();
    updateAnalytics();
    requestNotificationPermission();
    reminders.forEach(reminder => {
        scheduleNotification(reminder);
    });
});


habitForm.addEventListener('submit', handleHabitSubmit);
editHabitForm.addEventListener('submit', handleEditHabitSubmit);
cancelEditBtn.addEventListener('click', cancelEdit);
categoryForm.addEventListener('submit', handleCategorySubmit);
reminderForm.addEventListener('submit', handleReminderSubmit);

document.querySelector(".go-back").addEventListener("click", () => {
    window.location.href = "homepage.html";
});

filterCategorySelect.addEventListener("change", () =>
    {renderHabits
        (filterCategorySelect.value);}
);
clearDataBtn.addEventListener("click", clearAllData
);

function handleHabitSubmit(event) {
    event.preventDefault();
    const name =
        habitNameInput.value.trim();
    const category =
        habitCategorySelect.value;
    const frequency =
        habitFrequencySelect.value;
    if (!name) {
        alert("Please enter a habit name.");
        return;
    }
    addHabit(
        name,
        category,
        frequency
    );
    habitForm.reset();
}


function addHabit(
    name,
    category,
    frequency
) 
{
    const habit = {
        id: Date.now(),
        name: name,
        category: category,
        frequency: frequency,
        progress: 0,
        completed: false,
        streak: 0,
        longestStreak: 0,
        lastCompleted: null,
        lastUpdated: new Date().toISOString().split('T')[0],
    };

    habits.push(habit);
    saveData();
    renderHabits();
    updateReminderOptions();
    updateOverview();
    updateAnalytics();
}


function startEditHabit(id) {
    const habit =
        habits.find(
            habit => habit.id === id
        );
    if (!habit) {
        return;
    }
    habitToEdit = id;
    editHabitNameInput.value =
        habit.name;
    editHabitCategorySelect.value =
        habit.category;
    editHabitFrequencySelect.value =
        habit.frequency;
    editHabitSection.style.display =
        "block";
    document.getElementById(
        "add-habit"
    ).style.display = "none";
    editHabitSection.scrollIntoView({
        behavior: "smooth"
    });
}


function handleEditHabitSubmit(event) {
    event.preventDefault();
    if (habitToEdit === null) {
        return;
    }
    const newName =
        editHabitNameInput.value.trim();
    const newCategory =
        editHabitCategorySelect.value;
    const newFrequency =
        editHabitFrequencySelect.value;
    if (!newName) {
        alert("Please enter a habit name.");
        return;
    }
    habits = habits.map(habit => {
        if (habit.id === habitToEdit) {
            return {
                ...habit,
                name: newName,
                category: newCategory,
                frequency: newFrequency
            };
        }
        return habit;
    });
    saveData();
    renderHabits();
    updateReminderOptions();
    updateOverview();
    updateAnalytics();
    cancelEdit();
    alert("Habit updated successfully!");
}


function cancelEdit() {
    habitToEdit = null;
    editHabitSection.style.display ="none";
    document.getElementById("add-habit").style.display = "block";
    editHabitForm.reset();
}

function renderHabits(filter = "all") {
    habitList.innerHTML =
        "<h2>your habits</h2>";
    const filteredHabits =
        habits.
        filter(habit =>filter === "all" ||habit.category ===filter);
    if (filteredHabits.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No habits found.";
        habitList.appendChild(message
        );
        return;
    }

    filteredHabits.forEach(habit => {
        checkStreak(habit);
        const habitDiv = document.createElement("div");
        habitDiv.classList.add("habit");
        const title = document.createElement("h3"); 
        title.textContent = `${habit.name} (${habit.category})`;
        const streakText = document.createElement("p");
        streakText.innerHTML = `🔥 Current Streak: <strong>${habit.streak}</strong> day(s)<br>` +`🏆 Longest Streak: <strong>${habit.longestStreak}</strong> day(s)`;
        const progressContainer = document.createElement("div");
        progressContainer.classList.add( "progress");
        const progressBar = document.createElement("span");
        progressBar.classList.add( "progress-bar");
        progressBar.style.width = `${habit.progress}%`;
        progressContainer.appendChild(progressBar);
        const progressText = document.createElement("p");
        progressText.textContent =`Progress: ${habit.progress}%`;
        const completeButton =document.createElement("button");
        completeButton.textContent =
            habit.completed
                ? "Completed ✓"
                : "Mark as Complete";

        completeButton.classList.add( "complete-btn");
        completeButton.enabled =habit.completed;
        completeButton.addEventListener("click",() => { markHabitComplete(habit.id );
            });

        const editButton =
            document.createElement("button");
        editButton.textContent ="Edit";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click",
            () => { startEditHabit(habit.id);
            });

        const removeButton = document.createElement("button");
        removeButton.textContent ="Remove";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click",() => removeHabit(habit.id));


        habitDiv.appendChild(title);
        habitDiv.appendChild(streakText);
        habitDiv.appendChild(progressContainer);
        habitDiv.appendChild(progressText);
        habitDiv.appendChild(completeButton);
        habitDiv.appendChild(editButton);
        habitDiv.appendChild( removeButton);
        habitList.appendChild(habitDiv);
    });
    saveData();
}

function resetProgressIfNeeded(habit) {
    const today = new Date().toISOString().split('T')[0];
    if (habit.lastUpdated !== today) {
        const resetCondition = habit.frequency === 'daily' || (habit.frequency === 'weekly' && new Date(habit.lastUpdated) < new Date(today).setDate(new Date(today).getDate() - 7));
        if (resetCondition) {
            habit.progress = 0;
            habit.completed = false;
            habit.lastUpdated = today;
        }
    }
}
function markHabitComplete(id) {
    const habit =habits.find(habit => habit.id === id);
    if (!habit) {return;}
    const today = getToday();
    if ( habit.lastCompleted === today) {
        alert("You already completed this habit today!" );
        return; }
    if ( habit.frequency === "daily") {
        if (habit.lastCompleted) {
            const days = daysBetween( habit.lastCompleted,today);
            if (days === 1) {
                habit.streak++;
            } else {
                habit.streak = 1;}
        } else { 
            habit.streak = 1;}}
    else {
        if (habit.lastCompleted) {
            const days =daysBetween(habit.lastCompleted,today);
            if (days <= 7) {habit.streak++;
            } else {
                habit.streak = 1; }
        } else {
            habit.streak = 1; }}
    if (habit.streak >habit.longestStreak) {habit.longestStreak = habit.streak; }
    habit.longestStreak = Math.max(habit.streak, habit.longestStreak);
    habit.progress = 100;
    habit.completed = true;
    habit.lastCompleted = today;
    habit.lastUpdated = today;
    saveData();
    checkStreakMilestone(
        habit.streak,
        habit.name
    );
    renderHabits();
    updateOverview();
    updateAnalytics();
}


function checkStreak(habit) {
    if (!habit.lastCompleted) {
        return;
    }
    const today =getToday();
    const days =daysBetween(habit.lastCompleted,today);
    if (habit.frequency === "daily" && days > 1) {
        habit.streak = 0;
        habit.progress = 0;
        habit.completed = false; }
    if (habit.frequency === "weekly" && days > 7 ) {
        habit.streak = 0;
        habit.progress = 0;
        habit.completed = false;
    }
}


function checkStreakMilestone(streak, habitName) {
    if (
        streak >= 10 &&
        streak % 10 === 0
    ) {

        alert(
            `🔥 AMAZING!\n\n` +
            `You reached a ${streak}-day streak ` +
            `on "${habitName}"!\n\n` +
            `Keep going!`
        );
    }


    if (streak === 365) {

        alert(
            `🏆 ONE YEAR STREAK!\n\n` +
            `You have completed "${habitName}" ` +
            `for 365 days!\n\n` +
            `Incredible achievement! 🎉`
        );
    }
}

function removeHabit(id) {

    const habit =
        habits.find(
            habit => habit.id === id
        );

    if (!habit) {
        return;
    }

    const confirmed =
        confirm(
            `Delete "${habit.name}"?`
        );

    if (!confirmed) {
        return;
    }

    habits =
        habits.filter(
            habit => habit.id !== id
        );


    reminders =
        reminders.filter(
            reminder =>
                reminder.habitId !== id
        );


    saveData();

    renderHabits();

    renderReminders();

    updateReminderOptions();

    updateOverview();

    updateAnalytics();
}

function handleCategorySubmit(event) {

    event.preventDefault();

    const category =
        newCategoryInput.value.trim();

    if (!category) {
        return;
    }


    const exists =
        categories.some(
            existing =>
                existing.toLowerCase() ===
                category.toLowerCase()
        );

    if (exists) {

        alert(
            "That category already exists."
        );

        return;
    }


    categories.push(category);

    newCategoryInput.value = "";

    saveData();

    renderCategories();

    updateCategoryOptions();

    updateFilterOptions();
}


function renderCategories() {

    categoryList.innerHTML = "";

    categories.forEach(category => {

        const item =
            document.createElement("div");

        item.classList.add(
            "category-item"
        );

        item.textContent =
            category;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.addEventListener(
            "click",
            () => removeCategory(category)
        );

        item.appendChild(
            deleteButton
        );

        categoryList.appendChild(
            item
        );
    });
    updateAnalytics();
}


function removeCategory(name) {

    const categoryUsed =
        habits.some(
            habit =>
                habit.category === name
        );

    if (categoryUsed) {

        alert(
            "You cannot delete a category that is being used by a habit."
        );

        return;
    }


    categories =
        categories.filter(
            category =>
                category !== name
        );

    saveData();
    renderCategories();
    updateCategoryOptions();
    updateFilterOptions();
    updateAnalytics();
}


function updateCategoryOptions() {

    habitCategorySelect.innerHTML = "";

    editHabitCategorySelect.innerHTML = "";


    categories.forEach(category => {

        const option1 =
            document.createElement("option");

        option1.value =
            category;

        option1.textContent =
            category;

        habitCategorySelect.appendChild(
            option1
        );


        const option2 =
            document.createElement("option");

        option2.value =
            category;

        option2.textContent =
            category;

        editHabitCategorySelect.appendChild(
            option2
        );
    });
}


function updateFilterOptions() {

    filterCategorySelect.innerHTML =
        `<option value="all">All categories</option>`;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category;

        option.textContent =
            category;

        filterCategorySelect.appendChild(
            option
        );
    });
}


function handleReminderSubmit(event) {

    event.preventDefault();

    const habitId =
        Number(
            reminderHabitSelect.value
        );

    const time =
        reminderTimeInput.value;

    const frequency =
        reminderFrequencySelect.value;


    if (!habitId || !time) {

        alert(
            "Please select a habit and time."
        );

        return;
    }


    addReminder(
        habitId,
        time,
        frequency
    );

    reminderForm.reset();
}


function addReminder(
    habitId,
    time,
    frequency
) {

    const reminder = {

        id: Date.now(),

        habitId: habitId,

        time: time,

        frequency: frequency
    };


    reminders.push(
        reminder
    );

    saveData();

    renderReminders();

    scheduleNotification(
        reminder
    );

    alert(
        "Reminder created successfully!"
    );
}


function renderReminders() {

    reminderList.innerHTML = "";

    reminders.forEach(reminder => {

        const habit =
            habits.find(
                h =>
                    h.id ===
                    reminder.habitId
            );

        if (!habit) {
            return;
        }


        const item =
            document.createElement("div");

        item.classList.add(
            "reminder-item"
        );

        item.textContent =
            `Reminder: ${habit.name} at ${reminder.time} (${reminder.frequency}) `;


        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.addEventListener(
            "click",
            () => removeReminder(
                reminder.id
            )
        );


        item.appendChild(
            deleteButton
        );

        reminderList.appendChild(
            item
        );
    });
}


function updateReminderOptions() {

    reminderHabitSelect.innerHTML = "";

    if (habits.length === 0) {

        const option =
            document.createElement("option");

        option.textContent =
            "No habits available";

        option.disabled = true;

        reminderHabitSelect.appendChild(
            option
        );

        return;
    }


    habits.forEach(habit => {

        const option =
            document.createElement("option");

        option.value =
            habit.id;

        option.textContent =
            habit.name;

        reminderHabitSelect.appendChild(
            option
        );
    });
}


function removeReminder(id) {

    reminders =
        reminders.filter(
            reminder =>
                reminder.id !== id
        );

    saveData();

    renderReminders();
}


function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();
    }
}


function scheduleNotification(reminder) {

    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }


    const [hours, minutes] =
        reminder.time.split(":");


    const now =
        new Date();


    let reminderTime =
        new Date();


    reminderTime.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );


    if (
        reminderTime <= now
    ) {

        reminderTime.setDate(
            reminderTime.getDate() + 1
        );
    }


    const delay =
        reminderTime.getTime() -
        now.getTime();


    setTimeout(() => {

        showNotification(
            reminder
        );


        if (
            reminder.frequency ===
            "daily"
        ) {

            scheduleNotification(
                reminder
            );
        }


        else if (
            reminder.frequency ===
            "weekly"
        ) {

            setTimeout(
                () => {
                    showNotification(
                        reminder
                    );
                },
                7 *
                24 *
                60 *
                60 *
                1000
            );
        }

    }, delay);
}

var timeoutIds = [];
function scheduleReminder(){
    var title = document.getElementById("habitId").value;
    var title = document.getElementById("time").value;
    var title = document.getElementById("frequency").value;

    var TimeString = "" + time;
    var scheduledTime = new Date (TimeString);
    var currentTime = new Date();
    var timeDifference = scheduledTime - currentTime;

    if (timeDifference > 0){
        addReminder (habitId, time, frequency);

        var timeoutId = setTimeout (function () {
            document.getElementById('reminderHabit');

            var notification = new notification (title, {
                body: habitId, 
                requireInteraction: true,
        });
    }, timeDifference);
    timeoutIds.push(timeoutId);
} else {
    alert(" the scheduled time is in the past");
}
}


function showNotification(reminder) {

    const habit =
        habits.find(
            h =>
                h.id ===
                reminder.habitId
        );


    if (!habit) {
        return;
    }


    if (
        "Notification" in window &&
        Notification.permission ===
            "granted"
    ) {

        new Notification(
            "🔥 Habit Reminder",
            {
                body:
                    `Time to work on: ${habit.name}`
            }
        );
    }
}


function updateOverview() {

    const total =
        document.getElementById(
            "total-habits"
        );

    const completed =
        document.getElementById(
            "completed-habits"
        );

    const longest =
        document.getElementById(
            "longest-streak"
        );

    if (
        !total ||
        !completed ||
        !longest
    ) {
        return;
    }


    total.textContent =
        habits.length;


    completed.textContent =
        habits.filter(
            habit =>
                habit.completed
        ).length;


    const longestStreak =
        Math.max(
            ...habits.map(
                habit =>
                    habit.longestStreak || 0
            ),
            0
        );


    longest.textContent =
        `${longestStreak} days`;
}


function updateAnalytics() {

    const health =
        document.getElementById(
            "health-completed"
        );

    const productivity =
        document.getElementById(
            "productivity-completed"
        );

    const learning =
        document.getElementById(
            "learning-completed"
        );

    if (
        !health ||
        !productivity ||
        !learning
    ) {
        return;
    }


    health.textContent =
        habits.filter(
            habit =>
                habit.completed &&
                habit.category ===
                    "health"
        ).length;


    productivity.textContent =
        habits.filter(
            habit =>
                habit.completed &&
                habit.category ===
                    "productivity"
        ).length;


    learning.textContent =
        habits.filter(
            habit =>
                habit.completed &&
                habit.category ===
                    "learning"
        ).length;
}


function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function daysBetween(
    date1,
    date2
) {

    const first =
        new Date(
            date1 + "T00:00:00"
        );


    const second =
        new Date(
            date2 + "T00:00:00"
        );


    const difference =
        second.getTime() -
        first.getTime();


    return Math.round(
        difference /
        (1000 * 60 * 60 * 24)
    );
}

function saveData() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );


    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );


    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );
}


function clearAllData() {

    const confirmed =
        confirm(
            "Are you sure you want to delete ALL habits, categories and reminders?"
        );


    if (!confirmed) {
        return;
    }


    habits = [];


    categories = [
        "health",
        "productivity",
        "learning"
    ];


    reminders = [];


    saveData();


    renderHabits();

    renderCategories();

    renderReminders();

    updateCategoryOptions();

    updateFilterOptions();

    updateReminderOptions();

    updateOverview();

    updateAnalytics();


    alert(
        "All habit data has been cleared."
    );
}

