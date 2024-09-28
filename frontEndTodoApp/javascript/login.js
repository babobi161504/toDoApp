import { signIn } from "./services/authentication.js"; // Note the .js extension

const formSignIn = document.querySelector(".form");
const userLocal = JSON.parse(localStorage.getItem("USER_INFO")) || [];
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const rememberMe = document.querySelector(".remember-me");
const error = document.querySelector(".error");
const eyePassword = document.querySelector(".password-eye");

function handleDOMContentLoaded() {
  const storage = {
    local: JSON.parse(localStorage.getItem("LOGGED_IN_USER")),
    session: JSON.parse(sessionStorage.getItem("LOGGED_IN_USER")),
  };

  if (
    (storage.local && storage.local.loggedIn) ||
    (storage.session && storage.session.loggedIn)
  ) {
    window.location.href = "../html/main.html";
  }
}

async function handleLogin(event) {
  event.preventDefault();

  // Check if username and password fields are filled
  if (!userName.value || !password.value) {
    error.innerText = "Please fill in all the required information";
    return;
  }
  try {
    // Attempt to sign in
    const token = await signIn(userName.value, password.value);
    // Handle remember me functionality
    if (rememberMe.checked) {
      localStorage.setItem(
        "LOGGED_IN_USER",
        JSON.stringify({ token, loggedIn: true })
      );
    } else {
      sessionStorage.setItem(
        "LOGGED_IN_USER",
        JSON.stringify({ token, loggedIn: true })
      );
    }

    // Redirect to main page on successful login
    window.location.href = "../html/main.html";
  } catch (error) {
    // Display error message
    error.innerText = error || "An error occurred during login";
  }
}

function handleEyePassword() {
  password.type = password.type === "password" ? "text" : "password";
}

// Event listeners
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
formSignIn.addEventListener("submit", handleLogin);
eyePassword.addEventListener("click", handleEyePassword);
