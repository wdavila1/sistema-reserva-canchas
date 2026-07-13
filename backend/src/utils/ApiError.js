/** Error controlado con código HTTP explícito. Lo usan los services/controllers
 * para casos esperados (401, 404, 409, etc.), a diferencia de un error inesperado
 * (bug/caída de DB) que cae en error.middleware.js como 500. */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
