const { url } = require("inspector");
module.exports = {
  task: {
    addTask: {
      value: "/add-task",
    },
    updateTask: {
      value: "/update-task",
    },
    getTask: {
      value: "/get-task",
    },
    deleteTask: {
      value: "/delete-task",
    },
  },
  user: {
    login: {
      value: "/login",
    },
  },
};
