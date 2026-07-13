import { ApiError } from "../utils/ApiError.js";

/** Debe usarse DESPUÉS de verificarToken. Ej: requiereRol(['Administrador']) */
export function requiereRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "No autenticado.");
    }
    if (!rolesPermitidos.includes(req.user.nombreRol)) {
      throw new ApiError(403, "No tienes permiso para realizar esta acción.");
    }
    next();
  };
}
