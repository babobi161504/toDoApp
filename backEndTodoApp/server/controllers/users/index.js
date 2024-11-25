const { MongoClient } = require("mongodb");
const { httpStatusCodes } = require("../../utils/constant");
const { createBearerToken, getDataFromRequest } = require("../../utils/helper");

const uri =
  "mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/";
const client = new MongoClient(uri);

// Đảm bảo kết nối tới MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("todo_app");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function handleLogin(request, response) {
  try {
    const requestData = await getDataFromRequest(request);
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      username: requestData.username,
      password: requestData.password,
    });
    if (user) {
      const userToken = createBearerToken(user._id);
      response.writeHead(httpStatusCodes.OK, {
        "Content-Type": "application/json",
      });
      response.end(userToken);
    } else {
      response.writeHead(httpStatusCodes.UNAUTHORIZED, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ error: "Invalid username or password" }));
    }
    
  } catch (error) {
    response.writeHead(httpStatusCodes.INTERNAL_SERVER_ERROR, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ error: "Internal server error" }));
  }
}

async function handleRegister(request, response) {
  try {
    const chunks = [];
    const requestData = await getDataFromRequest(request);
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({
      username: requestData.username,
    });
    if (existingUser) {
      response.statusCode = httpStatusCodes.CONFLICT;
      response.end("Username already exists");
      return;
    }
    const newUser = {
      username: requestData.username,
      password: requestData.password,
      token: "",
    };
    await usersCollection.insertOne(newUser);
    const user = await usersCollection.findOne({
      username: requestData.username,
      password: requestData.password,
    });

    //Tạo token cho user
    const userToken = createBearerToken(user._id);
    //Trả về token cho frontend dưới dạng JSON
    response.statusCode = httpStatusCodes.CREATED;
    response.setHeader("Content-Type", "application/json");
    const responseBody = JSON.stringify({ token: userToken });
    response.end(responseBody);
   
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

module.exports = {
  handleLogin,
  handleRegister,
};
