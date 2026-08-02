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

// Reservas detalladas de un usuario
export async function historialPorUsuario(usuarioID) {

    const { rows } = await pool.query(
        `SELECT r.ReservaID, r.UsuarioID, r.FechaReserva, r.EstadoReserva, r.Total, r.FechaModificacion,
                d.DetalleReservaID, d.CanchaID, d.Fecha, d.HoraInicio, d.HoraFin, d.PrecioHora, d.SubTotal,
                c.NombreCancha, c.TipoCanchaID,
                t.NombreTipo,
                p.PrimerNombre, p.PrimerApellido, p.Correo,
                u.NombreUsuario
            FROM Reservas r
            JOIN Usuarios u ON u.UsuarioID = r.UsuarioID
            JOIN Personas p ON p.PersonaID = u.PersonaID
            JOIN DetalleReservas d ON d.ReservaID = r.ReservaID
            JOIN Canchas c ON c.CanchaID = d.CanchaID
            JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
            WHERE r.UsuarioID = $1
            ORDER BY r.FechaReserva DESC, d.Fecha, d.HoraInicio`,
        [usuarioID]
    );
    return rows;
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