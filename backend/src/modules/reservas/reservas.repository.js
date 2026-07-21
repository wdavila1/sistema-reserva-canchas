// Queries SQL contra Reservas y DetalleReservas (incluye el manejo del EXCLUDE de horarios).
import { pool } from "../../config/db.js";

export async function obtenerReservaPorId(reservaId) {
  const { rows } = await pool.query(
    `SELECT r.ReservaID, r.UsuarioID, r.FechaReserva, r.EstadoReserva,
            r.Total, r.FechaModificacion,
            d.DetalleReservaID, d.CanchaID, d.Fecha, d.HoraInicio, d.HoraFin,
            d.PrecioHora, d.Subtotal,
            c.NombreCancha, c.TipoCanchaID, t.NombreTipo
       FROM Reservas r
       JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
       JOIN Canchas c ON c.CanchaID = d.CanchaID
       JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
      WHERE r.ReservaID = $1
      ORDER BY d.Fecha, d.HoraInicio`,
    [reservaId]
  );
  return rows;
}


export async function obtenerReservaPorUsuario(usuarioId) {
    const { rows } = await pool.query(
        `SELECT r.ReservaID, r.FechaReserva, r.EstadoReserva, r.Total, r.FechaModificacion,
            d.DetalleReservaID, d.CanchaID, d.Fecha, d.HoraInicio, d.HoraFin,
            d.PrecioHora, d.Subtotal,
            c.NombreCancha, t.NombreTipo
       FROM Reservas r
       JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
       JOIN Canchas c ON c.CanchaID = d.CanchaID
       JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
      WHERE r.UsuarioID = $1
      ORDER BY r.FechaReserva DESC, d.Fecha, d.HoraInicio`,
    [usuarioId]
  );
  return rows;
}


export async function obtenerTodasLasReservas() { //esta solo sera para el administrador , usamos requiereRol administrador para poder verlas
    const { rows } = await pool.query (
        `SELECT r.ReservaID, r.UsuarioID, r.FechaReserva, r.EstadoReserva, r.Total,
            r.FechaModificacion, p.PrimerNombre, p.PrimerApellido, p.Correo,
            d.DetalleReservaID, d.CanchaID, d.Fecha, d.HoraInicio, d.HoraFin,
            d.PrecioHora, d.Subtotal, c.NombreCancha, t.NombreTipo 
        FROM Reservas r
        JOIN Usuarios u ON u.UsuarioID = r.UsuarioID
        JOIN Personas p ON p.PersonaID = u.PersonaID
        JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
        JOIN Canchas c ON c.CanchaID = d.CanchaID
        JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
        ORDER BY r.FechaReserva DESC`
    );
    return rows;
    
}

export async function actualizarEstadoReserva(reservaId, nuevoEstado) {
    const { rows } = await pool.query(
        `UPDATE Reservas
            SET EstadoReserva = $2, FechaModificacion = CURRENT_TIMESTAMP
            WHERE ReservaID = $1
            RETURNING ReservaID , EstadoReserva, FechaModificacion `,
        [reservaId, nuevoEstado]
    );   
    return rows   
}

export async function crearReservaConDetalle({ usuarioId, total, bloques }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
 
    const reservaResult = await client.query(
      `INSERT INTO Reservas (UsuarioID, Total)
       VALUES ($1, $2)
       RETURNING ReservaID`,
      [usuarioId, total]
    );
    const reservaId = reservaResult.rows[0].reservaid;
 
    for (const bloque of bloques) {
      await client.query(
        `INSERT INTO DetalleReservas
                (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          reservaId,
          bloque.canchaId,
          bloque.fecha,
          bloque.horaInicio,
          bloque.horaFin,
          bloque.precioHora,
          bloque.subtotal,
        ]
      );
    }
 
    await client.query("COMMIT");
    return reservaId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err; // el service decide si es 23P01 (choque de horario) u otro error
  } finally {
    client.release();
  }
}

export async function cancelarReserva(reservaId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
 
    await client.query(`DELETE FROM DetalleReservas WHERE ReservaID = $1`, [
      reservaId,
    ]);
 
    const { rows } = await client.query(
      `UPDATE Reservas
          SET EstadoReserva = 'Cancelada', FechaModificacion = CURRENT_TIMESTAMP
        WHERE ReservaID = $1
        RETURNING ReservaID, EstadoReserva, FechaModificacion`,
      [reservaId]
    );
 
    await client.query("COMMIT");
    return rows[0] || null;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
 
export async function obtenerEncabezadoReserva(reservaId) { //esta funcion la puse para mostrarle al usuario un resumen rapido a la hora de finalizar su reserva o ver sus reservas
  const { rows } = await pool.query(
    `SELECT ReservaID, UsuarioID, EstadoReserva, Total
       FROM Reservas
      WHERE ReservaID = $1`,
    [reservaId]
  );
  return rows[0] || null;
}