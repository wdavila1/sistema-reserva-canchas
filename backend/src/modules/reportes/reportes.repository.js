import { pool } from "../../config/db.js";

// Reservas agrupadas por mes
export async function obtenerReporteReservasPorPeriodo({ fechaInicio, fechaFin, soloConIngreso = true }) {

    const whereEstado = soloConIngreso ? "AND r.EstadoReserva IN ('Confirmada', 'Completada')" : "";

    const { rows } = await pool.query(
        `SELECT TO_CHAR(DATE_TRUNC('month', r.FechaReserva),'YYYY-MM') AS periodo,
                COUNT(DISTINCT r.ReservaID) AS reservas,
                COALESCE(SUM(r.Total), 0) AS ingresos
            FROM Reservas r
            WHERE r.FechaReserva >= $1
            AND r.FechaReserva < $2
            ${whereEstado}
            GROUP BY periodo
            ORDER BY periodo ASC;`,
        [fechaInicio, fechaFin]
    );
    return rows;
}

// Conteo de canchas mas usadas y sus ingresos
export async function canchasMasUsadas({ fechaInicio, fechaFin, soloConIngreso = true }) {

    const joinReserva = soloConIngreso
        ? `JOIN Reservas r ON r.ReservaID = d.ReservaID AND r.EstadoReserva IN ('Confirmada', 'Completada')`
        : `JOIN Reservas r on r.ReservaID = d.ReservaID`;

    const { rows } = await pool.query(
        `SELECT c.CanchaID, c.NombreCancha, COUNT(d.DetalleReservaID) AS cantidadReservas, COALESCE(SUM(d.SubTotal), 0) AS ingresos
            FROM DetalleReservas d
            ${joinReserva}
            JOIN Canchas c ON c.CanchaID = d.CanchaID
            WHERE r.FechaReserva >= $1
                AND r.FechaReserva < $2
            GROUP BY c.CanchaID, c.NombreCancha
            ORDER BY cantidadReservas DESC`,
        [fechaInicio, fechaFin]
    );
    return rows;
}

// Ingresos netos y brutos
export async function kpisResumen({ fechaInicio, fechaFin, soloConIngreso = true }) {

    const whereEstado = soloConIngreso
        ? `AND EstadoReserva IN ('Confirmada', 'Completada')`
        : "";

    const { rows } = await pool.query(
        `SELECT
            COUNT(*)::int as totalReservas,
            COALESCE(SUM(Total), 0)::numeric AS totalIngresos,
            COALESCE(SUM(Total) * 0.15, 0)::numeric as isv,
            COALESCE(SUM(Total) - SUM(Total) * 0.15, 0)::numeric as ingresosnetos
            FROM Reservas
            WHERE FechaReserva >= $1
            AND FechaReserva < $2
            ${whereEstado}`,
        [fechaInicio, fechaFin]
    );

    return rows[0] || null;
}

export async function obtenerReservasHoy() {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS reservashoy
       FROM Reservas
      WHERE EstadoReserva IN ('Confirmada','Pendiente','Completada')
        AND FechaReserva::date = CURRENT_DATE`
  );
  return rows[0];
}