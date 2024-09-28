const apiUserURL = "http://127.0.0.1:3000";
export async function signIn(username, password) {
  try {
    const header = {
      "Content-Type": "application/json",
    };
    const user = {
      username: username,
      password: password,
    };
    const response = await fetch(`${apiUserURL}/login`, {
      method: "POST", // magic value
      headers: header,
      body: JSON.stringify(user),
      // mode: "no-cors",
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

export async function signUp(username, password) {
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
      mode: "no-cors",
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

// // Example usage
// (async () => {
//   try {
//     const signUpResponse = await signUp(
//       "newUsersasdsdsadasdsaasdsdasdsad",
//       "newPassword"
//     );
//     console.log("Sign Up Success:", signUpResponse);

//     const signInResponse = await signIn("newUser", "newPassword");
//     console.log("Sign In Success:", signInResponse);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// })();
