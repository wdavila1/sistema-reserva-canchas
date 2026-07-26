// Queries SQL contra Pagos, MetodosPago.
// TODO: implementar.
import { pool } from "../../config/db.js";

export async function obtenerPagosPendientes() {
   const query = `
            SELECT
            r.reservaid AS idReserva,
            CONCAT(p.primernombre, ' ', p.primerapellido) AS nombreUsuario,
            c.nombrecancha AS canchaReservada,
            dr.preciohora AS precioHora,
            TO_CHAR(dr.fecha, 'YYYY-MM-DD') AS fechaReserva,
            TO_CHAR(dr.horainicio, 'HH24:MI') AS horaInicio,
            TO_CHAR(dr.horafin, 'HH24:MI') AS horaFin,
            ROUND(EXTRACT(EPOCH FROM (dr.horafin - dr.horainicio)) / 3600, 1) AS numeroHoras,
            dr.subtotal AS subtotal,
            ROUND(dr.subtotal * 0.15, 2) AS isv,
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
