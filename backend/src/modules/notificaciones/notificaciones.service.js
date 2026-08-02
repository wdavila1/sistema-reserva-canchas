import { ApiError } from "../../utils/ApiError.js";
import * as notificacionesRepository from "./notificaciones.repository.js";

function toResponse(row) {
  return {
    id: row.notificacionid,
    usuarioId: row.usuarioid,
    reservaId: row.reservaid,
    tipo: row.tipo,
    mensaje: row.mensaje,
    fechaCreacion: row.fechacreacion,
    fechaProgramada: row.fechaprogramada,
    leido: row.leido,
    fechaLeido: row.fechaleido,
  };
}

// Devuelve las notificaciones del usuario para la campanita.
export async function obtenerNotificaciones(usuarioId) {
  const filas = await notificacionesRepository.obtenerNotificacionesPorUsuario(usuarioId);
  return filas.map(toResponse);
}

// Marca como leída. Valida que pertenezca al usuario (el repo ya lo hace por SQL).
export async function marcarComoLeida(notificacionId, usuarioId) {
  if (!notificacionId) {
    throw new ApiError(400, "Falta el ID de la notificación.");
  }
  const row = await notificacionesRepository.marcarComoLeida(notificacionId, usuarioId);
  if (!row) {
    throw new ApiError(404, "Notificación no encontrada o no pertenece al usuario.");
  }
  return toResponse(row);
}

// Genera los recordatorios para reservas que están a 24h. Lo llama el cron cada 30 min.
// Devuelve la cantidad de notificaciones creadas (0 si no había nada que notificar).
export async function generarRecordatorios() {
  const reservas = await notificacionesRepository.obtenerReservasParaRecordatorio();
  let creadas = 0;

  for (const r of reservas) {
    const mensaje = `Hola ${r.primernombre}, recuerda que mañana tienes reservada la cancha "${r.nombrecancha}" a las ${r.horainicio.slice(0, 5)}.`;

    const creada = await notificacionesRepository.crearNotificacion({
      usuarioId: r.usuarioid,
      reservaId: r.reservaid,
      tipo: "Recordatorio",
      mensaje,
      fechaProgramada: new Date(),
    });
    if (creada) creadas++;
  }

  return creadas;
}