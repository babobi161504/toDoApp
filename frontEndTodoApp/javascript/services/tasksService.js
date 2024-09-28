const apiUserURL = "http://127.0.0.1:3000";
export async function fetchTaskList(token) {
  try {
    // const token = localStorage.getItem("token");
    const response = await fetch(`${apiUserURL}/get-task`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    throw new Error("Network Error");
  }
}

export async function addTaskToServer(token, task) {
  // const token = localStorage.getItem("token");
  // const response = await fetch(`${apiTaskURL}`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(task),
  // });
  // if (!response.ok) {
  //   throw new Error(`Error: ${response.status} - ${response.statusText}`);
  // }
  // return response;
}
