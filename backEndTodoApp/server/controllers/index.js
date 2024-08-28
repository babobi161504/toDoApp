const taskControllers = require("./tasks");
const userControllers = require("./users");

function handleNotFound(req, res) {
  res.stastusCode = 404;
  res.end("Not found");
}
module.exports = {
  handleNotFound,
  taskControllers,
  userControllers,
  
};
