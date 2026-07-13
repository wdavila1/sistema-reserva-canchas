import { ApiError } from "../utils/ApiError.js";
import { verificarAccessToken } from "../utils/jwt.js";

/** Exige un JWT válido en el header Authorization: Bearer <token>.
 * Si es válido, adjunta req.user = { usuarioId, rolId, nombreRol }. */
export function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "No se envió un token de autenticación.");
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verificarAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    throw new ApiError(401, "Token inválido o expirado.");
  }
}
