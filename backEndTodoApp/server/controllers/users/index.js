// const fs = require("fs");
// const { Module } = require("module");
// const { buffer } = require("stream/consumers");
// const path = "./user.json";
// const { httpStatusCodes } = require("../../utils/constant");

// const { MongoClient } = require("mongodb");
// const uri = 'mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/';
// const client = new MongoClient(uri);

// function handleLogin(request, response) {
//   const chunks = [];
//   request.on("data", (chunk) => {
//     chunks.push(chunk);
//   });
//   request.on("end", () => {
//     const requestData = JSON.parse(Buffer.concat(chunks).toString());
//     fs.readFile(path, "utf8", (error, data) => {
//       if (error) {
//         console.log(error);
//         response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//         response.end("Internal server error");
//         return;
//       }
//       const users = JSON.parse(data);
//       const user = users.find(
//         (u) =>
//           u.username === requestData.username &&
//           u.password === requestData.password
//       );
//       if (user) {
//         var token = `${user.username}.${user.password}`;
//         user.token = token;
//         const index = users.findIndex((u) => u.username === user.username);
//         users[index] = user;
//         fs.writeFile(path, JSON.stringify(users), (error) => {
//           if (error) {
//             console.log(error);
//             response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//             response.end("Internal server error");
//             return;
//           }
//         });
//         response.statusCode = httpStatusCodes.OK;
//         response.end(token);
//         return;
//       }
//       response.statusCode = httpStatusCodes.UNAUTHORIZED;
//       response.end("Invalid username or password");
//     });
//   });
// }

// function handleRegister(request, response) {
//   const chunks = [];
//   request.on("data", (chunk) => {
//     chunks.push(chunk);
//   });
//   request.on("end", () => {
//     const requestData = JSON.parse(Buffer.concat(chunks).toString());
//     fs.readFile(path, "utf8", (error, data) => {
//       if (error) {
//         console.log(error);
//         response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//         response.end("Internal server error");
//         return;
//       }
//       const users = JSON.parse(data);

//       const existingUser = users.find(
//         (u) => u.username === requestData.username
//       );

      // if (existingUser) {
      //     user.token = null;
      //     const index = users.findIndex(u => u.username === user.username);
      //     users[index] = user;
      //     fs.writeFile(path, JSON.stringify(users), (error) => {
      //         if (error) {
      //             console.log(error);
      //             response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
      //             response.end("Internal server error");
      //             return;
      //         }
      //     });
      //     response.statusCode = httpStatusCodes.OK;
      //     response.end("Successfully logged out");
      //     return;
      // }
      // response.statusCode = httpStatusCodes.UNAUTHORIZED;
      // response.end("Invalid username");
//       if (existingUser) {
//         response.statusCode = httpStatusCodes.CONFLICT;
//         response.end("Username already exists");
//         return;
//       }
//       const userId = `${requestData.username}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
//       const token = `${requestData.username}.${requestData.password}`;
//       const newUser = {
//         username: requestData.username,
//         password: requestData.password,
//         token: token,
//         userId: userId
//       };

//       users.push(newUser);

//       fs.writeFile(path, JSON.stringify(users), (error) => {
//         if (error) {
//           console.log(error);
//           response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
//           response.end("Internal server error");
//           return;
//         }
//         response.statusCode = httpStatusCodes.CREATED;
//         response.end(token);
//       });
//     });
//   });
// }

// module.exports = {
//   handleLogin,
//   handleRegister,
// };
const { MongoClient } = require("mongodb");
const { httpStatusCodes } = require("../../utils/constant");

// MongoDB connection URI
const uri = 'mongodb+srv://NguyenDucNghia:cmDmebL5168KMJPx@cluster0.gf1bc.mongodb.net/';
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
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });
    request.on("end", async () => {
      const requestData = JSON.parse(Buffer.concat(chunks).toString());

      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Tìm user với username và password
      const user = await usersCollection.findOne({
        username: requestData.username,
        password: requestData.password
      });

      if (user) {
        const token = `${user.username}.${user.password}`;
        // Cập nhật token cho người dùng
        await usersCollection.updateOne(
          { username: user.username },
          { $set: { token: token } }
        );

        response.statusCode = httpStatusCodes.OK;
        response.end(token);
      } else {
        response.statusCode = httpStatusCodes.UNAUTHORIZED;
        response.end("Invalid username or password");
      }
    });
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.end("Internal server error");
  }
}

async function handleRegister(request, response) {
  try {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });
    request.on("end", async () => {
      const requestData = JSON.parse(Buffer.concat(chunks).toString());

      const db = await connectToDatabase();
      const usersCollection = db.collection("users");

      // Kiểm tra nếu user đã tồn tại
      const existingUser = await usersCollection.findOne({
        username: requestData.username
      });

      if (existingUser) {
        response.statusCode = httpStatusCodes.CONFLICT;
        response.end("Username already exists");
        return;
      }

      const token = `${requestData.username}.${requestData.password}`;
      const newUser = {
        username: requestData.username,
        password: requestData.password,
        token: token,
        
      };

      // Thêm user mới vào MongoDB
      await usersCollection.insertOne(newUser);

      response.statusCode = httpStatusCodes.CREATED;
      response.end(token);
    });
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
