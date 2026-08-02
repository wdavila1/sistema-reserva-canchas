import { pool } from "../../config/db.js";

export async function crearNotificacion({ usuarioId, reservaId, tipo, mensaje, fechaProgramada }) {
  const { rows } = await pool.query(
    `INSERT INTO Notificaciones (UsuarioID, ReservaID, Tipo, Mensaje, FechaProgramada)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (ReservaID, Tipo) WHERE ReservaID IS NOT NULL DO NOTHING
     RETURNING NotificacionID, UsuarioID, ReservaID, Tipo, Mensaje,
               FechaCreacion, FechaProgramada, Leido, FechaLeido`,
    [usuarioId, reservaId, tipo, mensaje, fechaProgramada]
  );
  return rows[0] || null;
}

export async function obtenerNotificacionesPorUsuario(usuarioId, { limite = 20 } = {}) {
  const { rows } = await pool.query(
    `SELECT NotificacionID, UsuarioID, ReservaID, Tipo, Mensaje,
            FechaCreacion, FechaProgramada, Leido, FechaLeido
       FROM Notificaciones
      WHERE UsuarioID = $1
      ORDER BY Leido ASC, FechaCreacion DESC
      LIMIT $2`,
    [usuarioId, limite]
  );
  return rows;
}

export async function marcarComoLeida(notificacionId, usuarioId) {
  const { rows } = await pool.query(
    `UPDATE Notificaciones
        SET Leido = TRUE, FechaLeido = CURRENT_TIMESTAMP
      WHERE NotificacionID = $1 AND UsuarioID = $2
      RETURNING NotificacionID, UsuarioID, ReservaID, Tipo, Mensaje,
                FechaCreacion, FechaProgramada, Leido, FechaLeido`,
    [notificacionId, usuarioId]
  );
  return rows[0] || null;
}

export async function obtenerReservasParaRecordatorio() {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (r.ReservaID)
            r.ReservaID, r.UsuarioID,
            p.PrimerNombre, p.PrimerApellido,
            d.Fecha, d.HoraInicio, d.HoraFin,
            c.NombreCancha
       FROM Reservas r
       JOIN Usuarios u ON u.UsuarioID = r.UsuarioID
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
       JOIN Canchas c  ON c.CanchaID = d.CanchaID
      WHERE r.EstadoReserva IN ('Confirmada', 'Pendiente')
        AND (d.Fecha + d.HoraInicio) >= (CURRENT_TIMESTAMP + INTERVAL '23 hours')
        AND (d.Fecha + d.HoraInicio) <  (CURRENT_TIMESTAMP + INTERVAL '25 hours')
      ORDER BY r.ReservaID, (d.Fecha + d.HoraInicio) ASC`
  );
  return rows;
}