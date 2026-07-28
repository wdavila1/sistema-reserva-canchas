// Queries SQL contra Pagos, MetodosPago.
// TODO: implementar.
import { pool } from "../../../config/db.js"

export async function obtenerPagosPendientes(limit, offset) {
  const query = `
            SELECT
            r.reservaid AS idReserva,
            CONCAT(p.primernombre, ' ', p.primerapellido) AS nombreUsuario,
            c.nombrecancha AS canchaReservada,
            dr.preciohora AS precioHora,
            TO_CHAR(dr.fecha, 'YYYY-MM-DD') AS fechaReserva,
            TO_CHAR(dr.horainicio, 'HH24:MI') AS horaInicio,
            TO_CHAR(dr.horafin, 'HH24:MI') AS horaFin,
            FLOOR(EXTRACT(EPOCH FROM (dr.horafin - dr.horainicio)) / 3600) AS numeroHoras,
            dr.subtotal AS subtotal,
            ROUND(dr.subtotal * 0.15, 2) AS isv,
            r.total AS total,
            COUNT(*) OVER() AS totalRegistros
        FROM reservas r
        JOIN usuarios u ON u.usuarioid = r.usuarioid
        JOIN personas p ON p.personaid = u.personaid
        JOIN detallereservas dr ON dr.reservaid = r.reservaid
        JOIN canchas c ON c.canchaid = dr.canchaid
        WHERE r.estadoreserva = 'Pendiente'
        ORDER BY dr.fecha, dr.horainicio
        LIMIT $1
        OFFSET $2;
        `;
  const { rows } = await pool.query(query, [limit, offset]);
  return rows;

}

export async function obtenerPagosConfirmadosSinFactura(limit, offset) {
  const query = `
      SELECT 
      r.reservaid AS reservaId,
      CONCAT(p.primernombre, ' ', p.primerapellido) AS nombreUsuario,
      STRING_AGG(c.nombrecancha, ', ') AS canchaReservada,
      pa.monto AS total,
      mp.metodo AS metodoPago,
      TO_CHAR(pa.fechapago, 'YYYY-MM-DD') as fechaPago,
      COUNT(*) OVER() AS totalRegistros
      FROM pagos pa
      JOIN reservas r ON r.reservaid = pa.reservaid
      JOIN usuarios u ON r.usuarioid = u.usuarioid
      JOIN personas p ON p.personaid = u.personaid
      JOIN detallereservas dr ON dr.reservaid = r.reservaid
      JOIN canchas c ON c.canchaid = dr.canchaid
      JOIN metodospago mp ON pa.metodopagoid = mp.metodopagoid
      WHERE (r.estadoreserva = 'Confirmada' OR r.estadoreserva = 'Completada')
      AND pa.estadopago = 'Aprobado'
      AND pa.facturaid IS null
      GROUP BY r.reservaid, p.primernombre, p.primerapellido, pa.monto, mp.metodo, pa.fechapago
      LIMIT $1
      OFFSET $2;
  `
  const { rows } = await pool.query(query, [limit, offset]);
  return rows;

}

export async function obtenerPagosConfirmados(limit, offset, facturado) {
  const query = `
      SELECT 
      r.reservaid AS reservaId,
      CONCAT(p.primernombre, ' ', p.primerapellido) AS nombreUsuario,
      STRING_AGG(c.nombrecancha, ', ') AS canchaReservada,
      pa.monto AS total,
      mp.metodo AS metodoPago,
      TO_CHAR(pa.fechapago, 'YYYY-MM-DD') as fechaPago,
      COUNT(*) OVER() AS totalRegistros
      FROM pagos pa
      JOIN reservas r ON r.reservaid = pa.reservaid
      JOIN usuarios u ON r.usuarioid = u.usuarioid
      JOIN personas p ON p.personaid = u.personaid
      JOIN detallereservas dr ON dr.reservaid = r.reservaid
      JOIN canchas c ON c.canchaid = dr.canchaid
      JOIN metodospago mp ON pa.metodopagoid = mp.metodopagoid
      WHERE (r.estadoreserva = 'Confirmada' OR r.estadoreserva = 'Completada')
      AND pa.estadopago = 'Aprobado'
      AND ($1::boolean IS NULL 
          OR ($1::boolean = true AND pa.facturaid IS NOT NULL)
          OR ($1::boolean = false AND pa.facturaid IS NULL))
      GROUP BY r.reservaid, p.primernombre, p.primerapellido, pa.monto, mp.metodo, pa.fechapago
      LIMIT $2
      OFFSET $3;
  `;

  const { rows } = await pool.query(query, [facturado, limit, offset]);
  return rows;
}


export async function registrarPago(reservaId, metodoPagoId, monto) {
  const query = `
      INSERT INTO pagos (reservaid, metodopagoid, monto, estadopago)
      VALUES ($1, $2, $3, 'Aprobado')
      RETURNING pagoid;
    `;
  const { rows } = await pool.query(query, [
    reservaId,
    metodoPagoId,
    monto
  ]);

  return rows[0].pagoid;
}
