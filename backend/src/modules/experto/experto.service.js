import { pool } from "../../config/db.js";

/**
 * REGLA 1 – Horario óptimo del usuario
 * Analiza el historial de reservas de un usuario específico y retorna
 * el día de la semana y la hora en que más reserva (su "horario favorito").
 * Si tiene al menos 1 reserva, se genera una sugerencia personalizada.
 */
export async function obtenerHorarioOptimoUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT
        EXTRACT(DOW FROM dr.Fecha)::INT         AS dia_semana,
        TO_CHAR(dr.HoraInicio, 'HH24:MI')       AS hora_inicio,
        c.NombreCancha                           AS nombre_cancha,
        t.NombreTipo                             AS tipo_cancha,
        COUNT(*)::INT                            AS total_reservas
     FROM DetalleReservas dr
     JOIN Reservas         r  ON r.ReservaID  = dr.ReservaID
     JOIN Canchas          c  ON c.CanchaID   = dr.CanchaID
     JOIN TiposCancha      t  ON t.TipoCanchaID = c.TipoCanchaID
    WHERE r.UsuarioID = $1
      AND r.EstadoReserva IN ('Confirmada', 'Completada')
    GROUP BY dia_semana, hora_inicio, c.NombreCancha, t.NombreTipo
    ORDER BY total_reservas DESC
    LIMIT 1`,
    [usuarioId]
  );

  return rows[0] || null;
}

/**
 * REGLA 2 – Patrones de alta demanda
 * Agrupa todas las reservas de los últimos 60 días por día de la semana
 * y bloque horario. Calcula el porcentaje de ocupación sobre el total
 * de canchas activas disponibles. Devuelve los horarios "pico" con
 * ocupación >= 70%.
 *
 * Lógica:
 *   - Contamos cuántas veces se reservó cada bloque (dia, hora_inicio).
 *   - Calculamos el total de canchas disponibles (Estado = 'Disponible').
 *   - Ocupacion% = (reservas_en_bloque / total_canchas) * 100
 */
export async function obtenerPatronesAltaDemanda() {
  const { rows } = await pool.query(
    `WITH canchas_activas AS (
        SELECT COUNT(*) AS total FROM Canchas WHERE Estado != 'Mantenimiento'
     ),
     bloques AS (
        SELECT
            EXTRACT(DOW FROM dr.Fecha)::INT         AS dia_semana,
            TO_CHAR(dr.HoraInicio, 'HH24:MI')       AS hora_inicio,
            COUNT(*)::INT                            AS total_reservas
        FROM DetalleReservas dr
        JOIN Reservas r ON r.ReservaID = dr.ReservaID
        WHERE r.EstadoReserva IN ('Confirmada', 'Completada')
          AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
        GROUP BY dia_semana, hora_inicio
     )
     SELECT
        b.dia_semana,
        b.hora_inicio,
        b.total_reservas,
        ca.total                                        AS total_canchas,
        ROUND((b.total_reservas::NUMERIC / ca.total) * 100, 1) AS porcentaje_ocupacion
     FROM bloques b, canchas_activas ca
     WHERE ROUND((b.total_reservas::NUMERIC / ca.total) * 100, 1) >= 70
     ORDER BY porcentaje_ocupacion DESC`
  );

  return rows;
}

/**
 * REGLA 3 – Sugerencia de promociones para baja ocupación
 * Detecta bloques horarios con ocupación <= 30% en los últimos 60 días.
 * Para cada uno, genera una recomendación con el porcentaje de descuento
 * sugerido:
 *   - Ocupación < 15% → descuento sugerido 30%
 *   - Ocupación 15–30% → descuento sugerido 20%
 *
 * Excluye horarios que ya tienen una promoción activa para no duplicar.
 */
export async function obtenerSugerenciasPromociones() {
  const { rows } = await pool.query(
    `WITH canchas_activas AS (
        SELECT COUNT(*) AS total FROM Canchas WHERE Estado != 'Mantenimiento'
     ),
     bloques AS (
        SELECT
            EXTRACT(DOW FROM dr.Fecha)::INT         AS dia_semana,
            TO_CHAR(dr.HoraInicio, 'HH24:MI')       AS hora_inicio,
            COUNT(*)::INT                            AS total_reservas
        FROM DetalleReservas dr
        JOIN Reservas r ON r.ReservaID = dr.ReservaID
        WHERE r.EstadoReserva IN ('Confirmada', 'Completada')
          AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
        GROUP BY dia_semana, hora_inicio
     ),
     con_ocupacion AS (
        SELECT
            b.dia_semana,
            b.hora_inicio,
            b.total_reservas,
            ca.total AS total_canchas,
            ROUND((b.total_reservas::NUMERIC / ca.total) * 100, 1) AS porcentaje_ocupacion
        FROM bloques b, canchas_activas ca
        WHERE ROUND((b.total_reservas::NUMERIC / ca.total) * 100, 1) <= 30
     )
     SELECT
        co.dia_semana,
        co.hora_inicio,
        co.total_reservas,
        co.total_canchas,
        co.porcentaje_ocupacion,
        -- Regla heurística: menor ocupación → mayor descuento sugerido
        CASE
            WHEN co.porcentaje_ocupacion < 15 THEN 30
            ELSE 20
        END AS descuento_sugerido,
        -- ¿Ya existe una promoción activa para este horario?
        EXISTS (
            SELECT 1 FROM Promociones p
            WHERE p.Estado = TRUE
              AND (p.DiaSemana IS NULL OR p.DiaSemana = co.dia_semana)
              AND (p.HoraInicio IS NULL OR p.HoraInicio <= co.hora_inicio::TIME)
              AND (p.HoraFin    IS NULL OR p.HoraFin    >  co.hora_inicio::TIME)
        ) AS ya_tiene_promocion
     FROM con_ocupacion co
     ORDER BY co.porcentaje_ocupacion ASC`
  );

  return rows;
}

/**
 * REGLA EXTRA – Resumen global para el dashboard del administrador
 * Devuelve métricas generales del sistema experto en una sola llamada:
 *   - Total de horarios pico detectados
 *   - Total de sugerencias de promoción pendientes (sin promo activa)
 *   - Cancha más popular del mes
 */
export async function obtenerResumenExperto() {
  const { rows: pico } = await pool.query(
    `SELECT COUNT(*) AS total_pico
     FROM (
        WITH canchas_activas AS (SELECT COUNT(*) AS total FROM Canchas WHERE Estado != 'Mantenimiento'),
        bloques AS (
            SELECT EXTRACT(DOW FROM dr.Fecha)::INT AS dia_semana,
                   TO_CHAR(dr.HoraInicio, 'HH24:MI') AS hora_inicio,
                   COUNT(*) AS total_reservas
            FROM DetalleReservas dr
            JOIN Reservas r ON r.ReservaID = dr.ReservaID
            WHERE r.EstadoReserva IN ('Confirmada','Completada')
              AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
            GROUP BY dia_semana, hora_inicio
        )
        SELECT b.dia_semana
        FROM bloques b, canchas_activas ca
        WHERE ROUND((b.total_reservas::NUMERIC / ca.total)*100,1) >= 70
     ) t`
  );

  const { rows: sugerencias } = await pool.query(
    `SELECT COUNT(*) AS total_sugerencias
     FROM (
        WITH canchas_activas AS (SELECT COUNT(*) AS total FROM Canchas WHERE Estado != 'Mantenimiento'),
        bloques AS (
            SELECT EXTRACT(DOW FROM dr.Fecha)::INT AS dia_semana,
                   TO_CHAR(dr.HoraInicio,'HH24:MI') AS hora_inicio,
                   COUNT(*) AS total_reservas
            FROM DetalleReservas dr
            JOIN Reservas r ON r.ReservaID = dr.ReservaID
            WHERE r.EstadoReserva IN ('Confirmada','Completada')
              AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
            GROUP BY dia_semana, hora_inicio
        )
        SELECT b.dia_semana
        FROM bloques b, canchas_activas ca
        WHERE ROUND((b.total_reservas::NUMERIC / ca.total)*100,1) <= 30
          AND NOT EXISTS (
              SELECT 1 FROM Promociones p
              WHERE p.Estado = TRUE
                AND (p.DiaSemana IS NULL OR p.DiaSemana = b.dia_semana)
                AND (p.HoraInicio IS NULL OR p.HoraInicio <= b.hora_inicio::TIME)
                AND (p.HoraFin    IS NULL OR p.HoraFin    >  b.hora_inicio::TIME)
          )
     ) t`
  );

  const { rows: canchaTop } = await pool.query(
    `SELECT c.NombreCancha AS cancha_top, COUNT(*) AS reservas_mes
     FROM DetalleReservas dr
     JOIN Reservas r ON r.ReservaID = dr.ReservaID
     JOIN Canchas c  ON c.CanchaID  = dr.CanchaID
     WHERE r.EstadoReserva IN ('Confirmada','Completada')
       AND dr.Fecha >= DATE_TRUNC('month', CURRENT_DATE)
     GROUP BY c.NombreCancha
     ORDER BY reservas_mes DESC
     LIMIT 1`
  );

  return {
    horarios_pico: Number(pico[0]?.total_pico ?? 0),
    sugerencias_pendientes: Number(sugerencias[0]?.total_sugerencias ?? 0),
    cancha_mas_popular: canchaTop[0] || null,
  };
}
