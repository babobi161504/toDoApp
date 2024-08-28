const routerMethods = require('../methods.js')
const routes = require('../routes.js')
const {taskControllers} = require('../../controllers/index.js') 


const taskRouter = {
    run(req, res) {
        routerMethods.get(req, res, routes.task.getTask.value, taskControllers.handleGetTasksById)
        routerMethods.post(req, res, routes.task.addTask.value, taskControllers.handleAddTask);
        routerMethods.put(req, res, routes.task.updateTask.value, taskControllers.handleUpdateTask);
        routerMethods.delete(req, res, routes.task.deleteTask.value, taskControllers.handleDeleteTaskById);
    }
} 
module.exports =taskRouter;