const routerMethods = require("../methods.js");
const routes = require("../routes.js");

const userControllers = require("../../controllers/users/index.js");

const userRouter = {
  run(request, response) {
    routerMethods.post(
      request,
      response,
      routes.user.login.value,
      userControllers.handleLogin
    );
    
  },
};
module.exports = userRouter;
