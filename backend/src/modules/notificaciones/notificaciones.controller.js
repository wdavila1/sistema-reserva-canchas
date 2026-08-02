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

// POST /api/notificaciones/generar-pendientes — para forzar la generación manualmente (admin o testing).
// El cron NO usa este endpoint: llama a generarRecordatorios() directo desde server.js.
export const generarPendientes = asyncHandler(async (req, res) => {
  const creadas = await notificacionesService.generarRecordatorios();
  res.json({ creadas });
});