const homepageButton = document.querySelector(".hmp-btn");
const aboutButton = document.querySelector(".abt-btn");
const trackersButton = document.querySelector(".tck-btn");

homepageButton.addEventListener("click", function () {
    window.location.href = "homepage.html";
});

aboutButton.addEventListener("click", function () {
    window.location.href = "about.html";
});

trackersButton.addEventListener("click", function () {
    window.location.href = "trackers.html";
});