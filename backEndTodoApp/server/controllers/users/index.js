const fs = require("fs");
const { Module } = require("module");
const { buffer } = require("stream/consumers");
const path = "./user.json";
const { httpStatusCodes } = require("../../utils/constant");

function handleLogin(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", () => {
    const requestData = JSON.parse(Buffer.concat(chunks).toString());
    fs.readFile(path, "utf8", (error, data) => {
      if (error) {
        console.log(error);
        response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
        response.end("Internal server error");
        return;
      }
      const users = JSON.parse(data);
      const user = users.find(
        (u) =>
          u.username === requestData.username &&
          u.password === requestData.password
      );
      if (user) {
        var token = `${user.username}.${user.password}`;
        user.token = token;
        const index = users.findIndex((u) => u.username === user.username);
        users[index] = user;
        fs.writeFile(path, JSON.stringify(users), (error) => {
          if (error) {
            console.log(error);
            response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
            response.end("Internal server error");
            return;
          }
        });
        response.statusCode = httpStatusCodes.OK;
        response.end(token);
        return;
      }
      response.statusCode = httpStatusCodes.UNAUTHORIZED;
      response.end("Invalid username or password");
    });
  });
}

function handleResign(request, response) {
  const chunks = [];
  request.on("data", (chunk) => {
    chunks.push(chunk);
  });
  request.on("end", () => {
    const requestData = JSON.parse(Buffer.concat(chunks).toString());
    fs.readFile(path, "utf8", (error, data) => {
      if (error) {
        console.log(error);
        response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
        response.end("Internal server error");
        return;
      }
      const users = JSON.parse(data);

      const existingUser = users.find(
        (u) => u.username === requestData.username
      );

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

      users.push(newUser);

      fs.writeFile(path, JSON.stringify(users), (error) => {
        if (error) {
          console.log(error);
          response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
          response.end("Internal server error");
          return;
        }
        response.statusCode = httpStatusCodes.CREATED;
        response.end(token);
      });
    });
  });
}

module.exports = {
  handleLogin,
  handleResign,
};
