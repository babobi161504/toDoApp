const httpMethods = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
    PUT: 'PUT'
  }
  
  const folderPaths = {
    DATABASE: './databases'
  }
  
  const fileExtensions = {
    JSON: '.json'
  }
  
  const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  }
  
  module.exports = { httpMethods, folderPaths, fileExtensions, httpStatusCodes, routes }
  