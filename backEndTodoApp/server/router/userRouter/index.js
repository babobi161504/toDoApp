// const routerMethods = require("../methods.js");
// const routes = require("../routes.js");

// const userControllers = require("../../controllers/users/index.js");

// const userRouter = {
//    run(request, response) {
//     routerMethods.post(
//       request,
//       response,
//       routes.user.login.value,
//       userControllers.handleLogin
//     );
    
//   },
// };
// module.exports = userRouter;
const { httpMethods } = require("../../utils/constant.js");
const routerMethods = require("../methods.js");
const routes = require("../routes.js");
const userControllers = require("../../controllers/users/index.js");

const userRouter = {
  run(request, response) {
    
    if (request.method === httpMethods.POST && request.url === routes.user.login.value) {
      routerMethods.post(
        request,
        response,
        routes.user.login.value,
        userControllers.handleLogin
      );
    }
    if (request.method === httpMethods.POST && request.url === routes.user.register.value) {
      routerMethods.post(
        request,
        response,
        routes.user.register.value,
        userControllers.handleRegister
      );
    }
  },
};

module.exports = userRouter;
