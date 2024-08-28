const taskRouter = require("./taskRouter");
const userRouter = require("./userRouter");
const router = {
  run: function (req, res) {
    taskRouter.run(req, res);
    userRouter.run(req, res);
  },
};
module.exports = router
