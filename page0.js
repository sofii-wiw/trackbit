const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const signupForm = document.querySelector("form.signup");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.addEventListener("click", () => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.addEventListener("click", () => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

signupLink.addEventListener("click", (event) => {
    event.preventDefault();
    signupBtn.click();
});

// GET STORED ACCOUNTS

function getAccounts() {
    return JSON.parse(localStorage.getItem("accounts")) || [];
}

// SIGNUP

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = signupForm.querySelectorAll("input");

    const username = inputs[0].value.trim();
    const password = inputs[1].value;
    const confirmPassword = inputs[2].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const accounts = getAccounts();

    const accountExists = accounts.some(
        account => account.username.toLowerCase() === username.toLowerCase()
    );

    if (accountExists) {
        alert("This username already exists!");
        return;
    }

    const newAccount = {
        username: username,
        password: password
    };

    accounts.push(newAccount);

    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Account created successfully!");

    signupForm.reset();

    loginBtn.click();
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = loginForm.querySelectorAll("input");

    const username = inputs[0].value.trim();
    const password = inputs[1].value;

    const accounts = getAccounts();

    
    const account = accounts.find(
        account =>
            account.username.toLowerCase() === username.toLowerCase() &&
            account.password === password
    );

    if (account) {
        
        localStorage.setItem("loggedInUser", account.username);

        alert("Login successful!");

        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect username or password!");
    }
});
