const homepageButton = document.querySelector(".hmp-btn");
const aboutButton = document.querySelector(".abt-btn");
const trackersButton = document.querySelector(".tck-btn");

homepageButton.addEventListener("click", function () {
    window.location.href = "homepage.html";
});

aboutButton.addEventListener("click", function () {
    window.location.href = "dashboard.html#about";
});

trackersButton.addEventListener("click", function () {
    window.location.href = "trackers.html";
});

const themeSelect = document.getElementById('theme-select');
const htmlElement = document.documentElement;


const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
themeSelect.value = savedTheme;

themeSelect.addEventListener('change', (event) => { const selectedTheme = event.target.value;
  htmlElement.setAttribute('data-theme', selectedTheme);
  localStorage.setItem('theme', selectedTheme);
});