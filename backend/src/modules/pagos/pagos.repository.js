// Queries SQL contra Pagos, MetodosPago.
// TODO: implementar.
import { pool } from "../../config/db.js";

export async function obtenerPagosPendientes() {
    const query = `
                SELECT
                r.reservaid AS idReserva,
                CONCAT(p.primernombre, ' ', p.primerapellido) AS nombreUsuario,
                c.nombrecancha AS canchaReservada,
                dr.fecha AS fechaReserva,
                dr.horainicio AS horaInicio,
                dr.horafin AS horaFin,
                r.total AS total
            FROM reservas r
            JOIN usuarios u ON u.usuarioid = r.usuarioid
            JOIN personas p ON p.personaid = u.personaid
            JOIN detallereservas dr ON dr.reservaid = r.reservaid
            JOIN canchas c ON c.canchaid = dr.canchaid
            WHERE r.estadoreserva = 'Pendiente'
            ORDER BY dr.fecha, dr.horainicio;
            `;

  const { rows } = await pool.query(query);
  return rows;
}
