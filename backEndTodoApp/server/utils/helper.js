const fs = require("fs").promises;
const { error } = require("console");
const jwt = require("jsonwebtoken");
function createBearerToken(userID) {
  const payload = {
    id: userID,
  };
  const secret = "secretKey";
  const options = { expiresIn: "1800s" };
  return jwt.sign(payload, secret);
}
function verifyBearerToken(token) {
  const secret = "secretKey";

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function readJSONFile(path) {
  try {
    const jsonString = await fs.readFile(path, "utf8");
    return JSON.parse(jsonString);
  } catch (err) {
    console.error(`Failed to read file ${path}:`, err);
    throw new Error("File read failed");
  }
}

async function writeJSONFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to write file ${path}:`, err);
    throw new Error("File write failed");
  }
}

async function getDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON format"));
      }
    });
    req.on("error", (error) => {
      reject(error);
    });
  });
}


module.exports = {
  createBearerToken,
  verifyBearerToken,
  readJSONFile,
  writeJSONFile,
  getDataFromRequest,
};


