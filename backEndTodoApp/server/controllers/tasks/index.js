// const { MongoClient } = require("mongodb");
// const { httpStatusCodes } = require("../../utils/constant");

// // MongoDB connection URI
// const uri = 'mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/';
// const client = new MongoClient(uri);

// // Đảm bảo kết nối tới MongoDB
// async function connectToDatabase() {
//   try {
//     await client.connect();
//     return client.db("todo_app");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }
// const fs = require('fs');
// const { user } = require('../../router/routes');
// const { httpStatusCodes } = require('../../utils/constant');

// const path = "./tasks.json";
// const userPath = "./user.json";

// function authenticateUser (token) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(userPath, "utf8", (error, data) => {
//             if (error) {
//                 console.log(error);
//                 reject(error);
//             }
//             const users = JSON.parse(data);
//             const user = users.find(u => u.token === token);
//             if (user) {
//                 resolve(user.username);
//             }
//             reject("");
//         });
//     }).catch((error) => {
//         console.log(error);
//     })
// }

// //Create
// function handleAddTask(request, response) {
//     const chunks = [];
//     request.on('data', chunk => {
//         chunks.push(chunk);
//     });
//     request.on('end', async () => {
//         const task = Buffer.concat(chunks).toString();
//         const bearerToken = request.headers.authorization.split(" ")[1];
//         const newTask = JSON.parse(task);
//         fs.readFile(userPath, "utf8", (error, data) => {
//             if (error) {
//                 console.log(error);
//                 response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                 response.end();
//                 return;
//             }
//             const users = JSON.parse(data);
//             const user = users.find(u => u.username === bearerToken.split(".")[0] && u.password === bearerToken.split(".")[1]);
//             console.log(user)
//             if (!user) {
//                 response.statusCode = httpStatusCodes.UNAUTHORIZED;
//                 response.end("Unauthorized");
//                 return;
//             } else {
//                 fs.readFile(path, "utf8", (error, data) => {
//                     if (error) {
//                         console.log(error);
//                         response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                         response.end();
//                         return;
//                     }
//                     const tasks = JSON.parse(data);
//                     delete newTask.token;

//                     newTask.userId = user.userId;
//                     // const timestamp = Date.now();
//                     // const randomNum = Math.floor(Math.random() * 1000);
//                     // newTask.id = `${timestamp}${randomNum}`;

//                     tasks.push(newTask);
//                     fs.writeFile(path, JSON.stringify(tasks), (error) => {
//                         if (error) {
//                             console.log(error);
//                             response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                             response.end();
//                             return;
//                         }
//                     });
//                     response.statusCode = httpStatusCodes.OK;
//                     response.end(JSON.stringify(newTask));
//                 });
//             }
//         });
//     });
// }

// //Read
// function handleGetTasksById(request, response) {
//     const chunks = [];
//     request.on('data', chunk => {
//         chunks.push(chunk);
//     });
//     request.on('end', () => {
//         const bearerToken = request.headers.authorization.split(" ")[1];
//         console.log(bearerToken.split(".")[0]);
//         fs.readFile(userPath, "utf8", (error, data) => {
//             if (error) {
//                 console.log(error);
//                 response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                 response.end();
//                 return;
//             }
//             const users = JSON.parse(data);
//             console.log(users);
//             const user = users.find(u => u.username === bearerToken.split(".")[0] && u.password === bearerToken.split(".")[1]);
//             console.log(user);
//             if (!user) {
//                 response.statusCode = httpStatusCodes.UNAUTHORIZED;
//                 response.end("Unauthorized");
//                 return;
//             }else{
//                 fs.readFile(path, "utf8", (error, data) => {
//                     if (error) {
//                         console.log(error);
//                         response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                         response.end();
//                         return;
//                     }
//                     const tasks = JSON.parse(data);

//                     const userTasks = tasks.filter(t => t.owner === user.username);
//                     response.statusCode = httpStatusCodes.OK;
//                     response.end(JSON.stringify(tasks));
//                 });
//             }
//         });
//     });
// }

// //Update
// function handleUpdateTask(request, response) {
//     const chunks = [];
//     request.on('data', chunk => {
//         chunks.push(chunk);
//     });
//     request.on('end', () => {
//         const task = Buffer.concat(chunks).toString();
//         fs.readFile(path, "utf8", (error, data) => {
//             if (error) {
//                 console.log(error);
//                 response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                 response.end();
//                 return;
//             }
//             const updatedTask = JSON.parse(task);
//             const tasks = JSON.parse(data);

//             const index = tasks.findIndex(t => t.id === updatedTask.id);
//             if (index === -1) {

//                 response.statusCode = httpStatusCodes.NOT_FOUND;
//                 response.end(JSON.stringify({ error: "Task not found" }));
//                 return;
//             }

//             for (const key in updatedTask) {
//                 tasks[index][key] = updatedTask[key];
//             }

//             fs.writeFile(path, JSON.stringify(tasks), (error) => {
//                 if (error) {
//                     console.log(error);
//                     response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                     response.end();
//                     return;
//                 }
//             });
//             response.statusCode = httpStatusCodes.OK;
//             response.end(JSON.stringify(updatedTask));
//         });
//     });
// }

// //Delete
// function handleDeleteTaskById(request, response) {
//     const chunks = [];
//     request.on('data', chunk => {
//         chunks.push(chunk);
//     });
//     request.on('end', () => {
//         const taskId = JSON.parse(Buffer.concat(chunks).toString()).id;
//         fs.readFile(path, "utf8", (error, data) => {
//             if (error) {
//                 console.log(error);
//                 response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                 response.end();
//                 return;
//             }
//             const tasks = JSON.parse(data);
//             console.log(tasks);
//             const newTasks = tasks.filter(task => {
//                if (task.id !== taskId) {
//                 return task;
//                }
//             }, []);
//             console.log(newTasks);

//             fs.writeFile(path, JSON.stringify(newTasks), (error) => {
//                 if (error) {
//                     console.log(error);
//                     response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//                     response.end();
//                     return;
//                 }
//             });
//             response.statusCode = httpStatusCodes.OK;
//             response.end(`Task with id ${taskId} was deleted`);
//         });
//     });
// }

// module.exports = {
//     handleAddTask,
//     handleUpdateTask,
//     handleGetTasksById,
//     handleDeleteTaskById
// };
const { MongoClient, ObjectId } = require("mongodb");
const { httpStatusCodes } = require("../../utils/constant");

// MongoDB connection URI
const uri =
  "mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("todo_app");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Create
async function handleAddTask(request, response) {
  try {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });

    request.on("end", async () => {
      const taskData = JSON.parse(Buffer.concat(chunks).toString());
      const bearerToken = request.headers.authorization.split(" ")[1]; // Lấy token từ header
      const [username, password] = bearerToken.split(".");

      const db = client.db("todo_app");
      const users = db.collection("users");
      const tasks = db.collection("tasks");

      const user = await users.findOne({
        username: username,
        password: password,
      });

      if (!user) {
        response.statusCode = httpStatusCodes.UNAUTHORIZED;
        response.end("Unauthorized");
        return;
      }

      taskData.ownerId = user._id;

      await tasks.insertOne(taskData);

      response.statusCode = httpStatusCodes.CREATED;
      response.end(JSON.stringify(taskData));
    });
  } catch (error) {
    console.log("Error:", error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

// Read
async function handleGetTasksById(request, response) {
  try {
    const bearerToken = request.headers.authorization.split(" ")[1];

    const db = await connectToDatabase();
    const tasksCollection = db.collection("tasks");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ token: bearerToken });

    if (!user) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }

    const userTasks = await tasksCollection
      .find({ ownerId: user._id })
      .toArray();

    response.statusCode = httpStatusCodes.OK;
    response.end(JSON.stringify(userTasks));
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

// Update
async function handleUpdateTask(request, response) {
  try {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });

    request.on("end", async () => {
      const taskData = JSON.parse(Buffer.concat(chunks).toString());

      if (!taskData._id) {
        response.statusCode = httpStatusCodes.BAD_REQUEST;
        response.end("Task ID is required");
        return;
      }

      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      const taskId = new ObjectId(taskData._id);

      const updateFields = {};
      if (taskData.name) updateFields.name = taskData.name;
      if (taskData.description) updateFields.description = taskData.description;

      const result = await tasksCollection.updateOne(
        { _id: taskId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        response.statusCode = httpStatusCodes.NOT_FOUND;
        response.end("Task not found");
        return;
      }
      response.statusCode = httpStatusCodes.OK;
      response.end("Task updated successfully");
    });
  } catch (error) {
    console.error("Error updating task:", error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

// Delete
async function handleDeleteTaskById(request, response) {
  try {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });
    request.on("end", async () => {
      const requestData = JSON.parse(Buffer.concat(chunks).toString());
      const taskId = requestData._id;
      const objectId = new ObjectId(taskId);
      const db = await connectToDatabase();
      const tasksCollection = db.collection("tasks");

      const result = await tasksCollection.deleteOne({
        _id: objectId,
      });

      if (result.deletedCount === 0) {
        response.statusCode = httpStatusCodes.NOT_FOUND;
        response.end("Task not found");
        return;
      }

      response.statusCode = httpStatusCodes.OK;
      response.end(`Task with id ${taskId} was deleted`);
    });
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

module.exports = {
  handleAddTask,
  handleUpdateTask,
  handleGetTasksById,
  handleDeleteTaskById,
};
