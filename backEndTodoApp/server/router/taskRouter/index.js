const routerMethods = require("../methods.js");
const routes = require("../routes.js");
const { taskControllers } = require("../../controllers/index.js");

const taskRouter = {
  run(request, response) {
    routerMethods.get(
      request,
      response,
      routes.tasks.getTask.value,
      taskControllers.handleGetTasksByToken
    );
    routerMethods.post(
      request,
      response,
      routes.tasks.addTask.value,
      taskControllers.handleAddTask
    );
    routerMethods.put(
      request,
      response,
      routes.tasks.updateTask.value,
      taskControllers.handleUpdateTask
    );
    routerMethods.delete(
      request,
      response,
      routes.tasks.deleteTask.value,
      taskControllers.handleDeleteTaskById
    );
  },
};
module.exports = taskRouter;
