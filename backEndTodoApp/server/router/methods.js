const { httpMethods } = require("../utils/constant");

const routerMethods = {
  get: function (request, response, path, callback) {
    if (path === request.url && request.method === httpMethods.GET) {
      callback(request, response);
    }
  },
  post: function (request, response, path, callback) {
    if (path === request.url && request.method === httpMethods.POST) {
      callback(request, response);
    }
  },
  put: function (request, response, path, callback) {
    if (path === request.url && request.method === httpMethods.PUT) {
      callback(request, response);
    }
  },
  delete: function (request, response, path, callback) {
    if (path === request.url && request.method === httpMethods.DELETE) {
      callback(request, response);
    }
  },
};
module.exports = routerMethods;
