import { asyncHandler } from "../../utils/asyncHandler.js";
import * as notificacionesService from "./notificaciones.service.js";

// GET /api/notificaciones
export const getMisNotificaciones = asyncHandler(async (req, res) => {
  const notificaciones = await notificacionesService.obtenerNotificaciones(req.user.usuarioId);
  res.json({ notificaciones });
});

// PATCH /api/notificaciones/:id/leida
export const marcarLeida = asyncHandler(async (req, res) => {
  const notificacion = await notificacionesService.marcarComoLeida(
    Number(req.params.id),
    req.user.usuarioId
  );
  res.json({ notificacion });
});