const formSignUp = document.querySelector(".form");
const userName = document.querySelector(".username");
const password = document.querySelector(".password");
const repeatPassword = document.querySelector(".repeat-password");
const error = document.querySelector(".error");
const eyePassword = document.querySelector(".password-eye");
const eyeRepeatPassword = document.querySelector(".repeat-password-eye");
const users = JSON.parse(localStorage.getItem("USER_INFO")) || [];
const apiUserURL = "http://127.0.0.1:3000";
function generateUserId() {
  return btoa(userName.value) + Date.now();
}

function handleRegister(event) {
  event.preventDefault();
  const isUserExist = users.some(function (user) {
    return user.userName === userName.value;
  });
  if (!userName.value || !password.value || !repeatPassword.value) {
    error.innerText = "Please fill in all the required information";
  } else if (isUserExist) {
    error.innerText = "User already exists.";
  } else if (password.value != repeatPassword.value) {
    error.innerText = "Passwords do not match.";
  } else {
    const userId = generateUserId();

    users.push({
      userId: userId,
      userName: userName.value,
      password: password.value,
    });
    localStorage.setItem("USER_INFO", JSON.stringify(users));
    localStorage.removeItem("LOGGED_IN_USER");

    signUp(userName.value, password.value)
      .then((token) => {
        console.log("User registered successfully, token:", token);
        window.location.href = "../html/login.html";
      })
      .catch((error) => {
        console.error("Error during sign up:", error.message);
        error.innerText = "Failed to sign up. Please try again.";
      });
    // window.location.href = "../html/login.html";
  }
}
formSignUp.addEventListener("submit", handleRegister);

async function signUp(username, password) {
  try {
    const header = {
      "Content-Type": "application/json",
    };
    const user = {
      username: username,
      password: password,
    };
    const response = await fetch(`${apiUserURL}/register`, {
      method: "POST",
      headers: header,
      body: JSON.stringify(user),
    });
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
}
// formSignUp.addEventListener("submit", signUp);

// async function handleRegister(event) {
//   event.preventDefault();
//   if (!userName.value || !password.value || !repeatPassword.value) {
//     error.innerText = "Please fill in all the required information";
//     return;
//   }

//   if (password.value !== repeatPassword.value) {
//     error.innerText = "Passwords do not match.";
//     return;
//   }

//   try {
//     const response = await fetch("http://127.0.0.1:3000/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: userName.value,
//         password: password.value,
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const userId = generateUserId();
//       users.push({
//         userId: userId,
//         username: userName.value,
//         password: password.value,
//       });
//       localStorage.setItem("USER_INFO", JSON.stringify(users));
//       //Lưu token để đăng nhập
//       localStorage.setItem(
//         "LOGGED_IN_USER",
//         JSON.stringify({ loggedIn: true, token: data.token })
//       );
//       // localStorage.removeItem("LOGGED_IN_USER");
//       window.location.href = "../html/login.html";
//     } else {
//       const data = await response.json();
//       error.innerText = data.message || "Register failed.";
//     }
//   } catch (err) {
//     error.innerText = "An error occurred. Please try again.";
//   }
// }
// formSignUp.addEventListener("submit", handleRegister);

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
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleEyePassword() {
  password.type = password.type === "password" ? "text" : "password";
}

function handleEyeRepeatPassword() {
  repeatPassword.type =
    repeatPassword.type === "password" ? "text" : "password";
}
eyePassword.addEventListener("click", handleEyePassword);
eyeRepeatPassword.addEventListener("click", handleEyeRepeatPassword);
