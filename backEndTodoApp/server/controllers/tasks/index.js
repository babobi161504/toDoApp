const { MongoClient, ObjectId } = require("mongodb");
const { httpStatusCodes } = require("../../utils/constant");
const { verifyBearerToken } = require("../../utils/helper");
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
async function handleGetTasksByToken(request, response) {
  try {
    const decodedToken = verifyBearerToken(
      request.headers.authorization.split(" ")[1]
    );
    if (!decodedToken.success) {
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Unauthorized");
      return;
    }
    const _id = new ObjectId(decodedToken.data.id);

    const db = await connectToDatabase();
    const tasksCollection = db.collection("tasks");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: _id });

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
  handleGetTasksByToken,
  handleDeleteTaskById,
};
