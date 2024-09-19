const apiUserURL = "http://127.0.0.1:3000/tasks";
async function fetchTaskList() {
  try {
    const token = localStorage.getItem("token");
    const url = `${apiTaskUR}`;
    const response = await fetch(`${url}`, {
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

async function addTaskToServer(task) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${apiTaskURL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response;
}
