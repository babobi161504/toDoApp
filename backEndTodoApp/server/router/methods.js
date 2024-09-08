const routerMethods = {
  get: function (request, resonse, path, callback) {
    if (path === request.url && req.method === "GET") {
      callback(request, resonse);
    }
  },
  post: function (request, resonse, path, callback) {
    if (path === request.url && request.method === "POST") {
      callback(request, resonse);
    }
  },
  put: function (request, resonse, path, callback) {
    if (path === request.url && request.method === "PUT") {
      callback(req, resonse);
    }
  },
  delete: function (request, resonse, path, callback) {
    if (path === request.url && request.method === "DELETE") {
      callback(request, resonse);
    }
  },
};
module.exports = routerMethods;
