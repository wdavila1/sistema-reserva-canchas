// Queries SQL contra Reservas y DetalleReservas (incluye el manejo del EXCLUDE de horarios).
import { pool } from "../../config/db.js";

export async function obtenerReservaPorId(reservaId) {
  const { rows } = await pool.query(
    `SELECT r.ReservaID, r.UsuarioID, r.FechaReserva, r.EstadoReserva,
            r.Total, r.FechaModificacion,
            d.DetalleReservaID, d.CanchaID, d.Fecha, d.HoraInicio, d.HoraFin,
            d.PrecioHora, d.Subtotal, d.Descuento,
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
            d.PrecioHora, d.Subtotal, d.Descuento,
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


//esta esta encargada de consultar las reservas registradas y mostrarlas de forma pagina para el panel del administrador
//la función permite filtrar las reservas por estado y agrupa los diferentes bloques que son a una misma reserva mediante GROUP BY y STRING_AGG
//tambien para verificar el rango de horario de la reserva
export async function obtenerTodasLasReservas(limit, offset, estado) {
  const query = `
    SELECT
      r.ReservaID AS reservaid,
      r.UsuarioID AS usuarioid,
      r.EstadoReserva AS estadoreserva,
      r.Total AS total,
      r.FechaReserva AS fechareserva,
      r.FechaModificacion AS fechamodificacion,
      p.PrimerNombre AS primernombre,
      p.PrimerApellido AS primerapellido,
      p.Correo AS correo,
      STRING_AGG(DISTINCT c.NombreCancha, ', ') AS canchas,
      STRING_AGG(DISTINCT TO_CHAR(d.Fecha, 'YYYY-MM-DD'), ', ') AS fechas,
      MIN(d.HoraInicio) AS horainicio,
      MAX(d.HoraFin) AS horafin,
      COUNT(*) OVER() AS totalregistros
    FROM Reservas r
    JOIN Usuarios u ON u.UsuarioID = r.UsuarioID
    JOIN Personas p ON p.PersonaID = u.PersonaID
    JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
    JOIN Canchas c ON c.CanchaID = d.CanchaID
    WHERE ($3::varchar IS NULL OR r.EstadoReserva = $3)
    GROUP BY r.ReservaID, r.UsuarioID, r.EstadoReserva, r.Total,
             r.FechaReserva, r.FechaModificacion,
             p.PrimerNombre, p.PrimerApellido, p.Correo
    ORDER BY r.FechaReserva DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows } = await pool.query(query, [limit, offset, estado]);
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
                (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal, Descuento, PromocionID)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          reservaId,
          bloque.canchaId,
          bloque.fecha,
          bloque.horaInicio,
          bloque.horaFin,
          bloque.precioHora,
          bloque.subtotal,
          bloque.descuento ?? 0,
          bloque.promocionId ?? null,
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

export async function obtenerEstadoReserva(reservaId){
  const query = `
      SELECT 
      r.reservaid AS reservaid,
      r.estadoreserva AS estadoreserva
      FROM reservas
      WHERE r.reservaid = ${reservaId};
  `
  const { rows } = await pool.query(query);

  return rows;
}