import { ApiError } from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // eslint-disable-next-line no-console
  console.error("[error inesperado]", err);
  return res.status(500).json({ error: "Error interno del servidor." });
}
