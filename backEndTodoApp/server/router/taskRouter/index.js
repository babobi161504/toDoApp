const routerMethods = require("../methods.js");
const routes = require("../routes.js");
const { taskControllers } = require("../../controllers/index.js");

const taskRouter = {
  run(req, res) {
    routerMethods.get(
      req,
      res,
      routes.tasks.getTask.value,
      taskControllers.handleGetTasksById
    );
    routerMethods.post(
      req,
      res,
      routes.tasks.addTask.value,
      taskControllers.handleAddTask
    );
    routerMethods.put(
      req,
      res,
      routes.tasks.updateTask.value,
      taskControllers.handleUpdateTask
    );
    routerMethods.delete(
      req,
      res,
      routes.tasks.deleteTask.value,
      taskControllers.handleDeleteTaskById
    );
  },
};
module.exports = taskRouter;
