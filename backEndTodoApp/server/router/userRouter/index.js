const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const userControllers = require("../../controllers/users/index.js");


const userRouter = {
  run(req, res) {
    routerMethods.post(
      req,
      res,
      routes.user.login.value,
      userControllers.handleLogin
    );
  },
};
module.exports = userRouter;
