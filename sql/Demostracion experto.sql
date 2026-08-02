-- 
-- SEED DE DEMOSTRACIÓN – Sistema Experto
-- 
-- Propósito : Insertar reservas ficticias con fechas recientes para que
--             las 3 reglas del sistema experto devuelvan resultados
--             visibles en la página.
--
-- Canchas activas : 2, 3, 5, 6, 7
-- Usuario demo    : wilson1 (UsuarioID = 5)
--
-- REGLA 1 – Horario óptimo del usuario (sugerencia personalizada)
--   → yo wilson1 repito varios viernes a las 08:00 en cancha 5
--
-- REGLA 2 – Patrones de alta demanda (>= 70% ocupación)
--   → Lunes 08:00 y Miércoles 10:00 concentran muchas reservas
--     (5+ reservas sobre 5 canchas activas → 100% y 80%)
--
-- REGLA 3 – Sugerencias de promociones (<= 30% ocupación)
--   → Domingo 06:00 y Sábado 20:00 tienen pocas reservas (20%)
--
-- PARA REVERTIR: ejecutamos Limpiar demostracion.sql
-- =====================================================================

BEGIN;


-- 1. RESERVAS ENCABEZADO
--    EstadoReserva IN ('Confirmada','Completada') para que las
--    consultas del experto las cuenten.

INSERT INTO Reservas (UsuarioID, EstadoReserva, Total, FechaReserva) VALUES
-- Bloque A: wilson1 viernes 08:00 (REGLA 1 — patrón favorito)
  (5, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '7  days'),   -- n=1
  (5, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '14 days'),   -- n=2
  (5, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '21 days'),   -- n=3
  (5, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '28 days'),   -- n=4
-- Bloque B: alta demanda — Lunes 08:00 (REGLA 2: ~100%)
  (5, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '8  days'),   -- n=5
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '8  days'),   -- n=6
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '15 days'),   -- n=7
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '15 days'),   -- n=8
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '22 days'),   -- n=9
-- Bloque C: alta demanda — Miércoles 10:00 (REGLA 2: ~80%)
  (5, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '10 days'),   -- n=10
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '10 days'),   -- n=11
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '17 days'),   -- n=12
  (1, 'Confirmada', 150.00, CURRENT_TIMESTAMP - INTERVAL '24 days'),   -- n=13
-- Bloque D: baja demanda — Domingo 06:00 (REGLA 3: 20%)
  (5, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '3  days'),   -- n=14
-- Bloque E: baja demanda — Sábado 20:00 (REGLA 3: 20%)
  (1, 'Completada', 150.00, CURRENT_TIMESTAMP - INTERVAL '2  days');   -- n=15


-- 2. DETALLES DE RESERVAS usando bloque DO para aritmética de fechas

DO $$
DECLARE
  r_ids  INT[];
  hoy    DATE := CURRENT_DATE;
  d      INT  := EXTRACT(DOW FROM hoy)::INT;  -- 0=Dom..6=Sab

  fri_1  DATE;  fri_2  DATE;  fri_3  DATE;  fri_4  DATE;
  mon_1  DATE;  mon_2  DATE;  mon_3  DATE;
  wed_1  DATE;  wed_2  DATE;  wed_3  DATE;
  sun_1  DATE;
  sat_1  DATE;

BEGIN
  -- ── Viernes pasados (DOW = 5) ──────────────────────────────────
  fri_1 := hoy - (((d - 5 + 7) % 7) + CASE WHEN (d - 5 + 7) % 7 = 0 THEN 7 ELSE 0 END)::INT;
  fri_2 := fri_1 - 7;
  fri_3 := fri_1 - 14;
  fri_4 := fri_1 - 21;

  -- ── Lunes pasados (DOW = 1) ────────────────────────────────────
  mon_1 := hoy - (((d - 1 + 7) % 7) + CASE WHEN (d - 1 + 7) % 7 = 0 THEN 7 ELSE 0 END)::INT;
  mon_2 := mon_1 - 7;
  mon_3 := mon_1 - 14;

  -- ── Miércoles pasados (DOW = 3) ────────────────────────────────
  wed_1 := hoy - (((d - 3 + 7) % 7) + CASE WHEN (d - 3 + 7) % 7 = 0 THEN 7 ELSE 0 END)::INT;
  wed_2 := wed_1 - 7;
  wed_3 := wed_1 - 14;

  -- ── Domingo pasado (DOW = 0) ───────────────────────────────────
  sun_1 := hoy - (((d - 0 + 7) % 7) + CASE WHEN (d - 0 + 7) % 7 = 0 THEN 7 ELSE 0 END)::INT;

  -- ── Sábado pasado (DOW = 6) ────────────────────────────────────
  sat_1 := hoy - (((d - 6 + 7) % 7) + CASE WHEN (d - 6 + 7) % 7 = 0 THEN 7 ELSE 0 END)::INT;

  RAISE NOTICE 'Fechas calculadas — Viernes: %, %, %, % | Lunes: %, %, % | Mié: %, %, % | Dom: % | Sab: %',
    fri_1, fri_2, fri_3, fri_4,
    mon_1, mon_2, mon_3,
    wed_1, wed_2, wed_3,
    sun_1, sat_1;

  -- ── Obtener los 15 ReservaIDs recién insertados (sin detalles) ─
  SELECT ARRAY_AGG(ReservaID ORDER BY ReservaID ASC)
  INTO r_ids
  FROM (
    SELECT ReservaID
    FROM Reservas
    WHERE UsuarioID IN (1, 5)
      AND FechaReserva >= CURRENT_TIMESTAMP - INTERVAL '60 days'
      AND NOT EXISTS (
        SELECT 1 FROM DetalleReservas dr WHERE dr.ReservaID = Reservas.ReservaID
      )
    ORDER BY ReservaID ASC
    LIMIT 15
  ) sub;

  RAISE NOTICE 'ReservaIDs seed: %  (total=%)', r_ids, ARRAY_LENGTH(r_ids, 1);

  -- ═══════════════════════════════════════════════════════════════
  -- BLOQUE A – Viernes 08:00–09:00 cancha 5 (REGLA 1 wilson1)
  -- ═══════════════════════════════════════════════════════════════
  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[1], 5, fri_1, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[2], 5, fri_2, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[3], 5, fri_3, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[4], 5, fri_4, '08:00', '09:00', 150.00, 150.00);

  -- ═══════════════════════════════════════════════════════════════
  -- BLOQUE B – Lunes 08:00–09:00 (REGLA 2: alta demanda ~100%)
  -- Canchas distintas para respetar EXCL_Cancha_Horario
  -- ═══════════════════════════════════════════════════════════════
  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[5], 2, mon_1, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[6], 3, mon_1, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[7], 5, mon_2, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[8], 6, mon_2, '08:00', '09:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[9], 7, mon_3, '08:00', '09:00', 150.00, 150.00);

  -- ═══════════════════════════════════════════════════════════════
  -- BLOQUE C – Miércoles 10:00–11:00 (REGLA 2: alta demanda ~80%)
  -- ═══════════════════════════════════════════════════════════════
  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[10], 3, wed_1, '10:00', '11:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[11], 5, wed_1, '10:00', '11:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[12], 6, wed_2, '10:00', '11:00', 150.00, 150.00);

  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[13], 7, wed_3, '10:00', '11:00', 150.00, 150.00);

  -- ═══════════════════════════════════════════════════════════════
  -- BLOQUE D – Domingo 06:00–07:00 cancha 2 (REGLA 3: baja demanda)
  -- ═══════════════════════════════════════════════════════════════
  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[14], 2, sun_1, '06:00', '07:00', 150.00, 150.00);

  -- ═══════════════════════════════════════════════════════════════
  -- BLOQUE E – Sábado 20:00–21:00 cancha 3 (REGLA 3: baja demanda)
  -- ═══════════════════════════════════════════════════════════════
  INSERT INTO DetalleReservas (ReservaID, CanchaID, Fecha, HoraInicio, HoraFin, PrecioHora, Subtotal)
    VALUES (r_ids[15], 3, sat_1, '20:00', '21:00', 150.00, 150.00);

  RAISE NOTICE '✅  Seed del sistema experto insertado correctamente.';
END;
$$;

COMMIT;

-- ─────────────────────────────────────────────────────────────────────
-- VERIFICACIÓN RÁPIDA (ejecuta después de correr el seed):
-- ─────────────────────────────────────────────────────────────────────

-- REGLA 1 – sugerencia wilson1 (debe mostrar Viernes 08:00)
-- SELECT EXTRACT(DOW FROM dr.Fecha)::INT AS dia, TO_CHAR(dr.HoraInicio,'HH24:MI') AS hora,
--        c.NombreCancha, COUNT(*) AS total
-- FROM DetalleReservas dr
-- JOIN Reservas r ON r.ReservaID = dr.ReservaID
-- JOIN Canchas c  ON c.CanchaID  = dr.CanchaID
-- WHERE r.UsuarioID = 5 AND r.EstadoReserva IN ('Confirmada','Completada')
-- GROUP BY dia, hora, c.NombreCancha ORDER BY total DESC LIMIT 5;

-- REGLA 2 – alta demanda (debe mostrar Lunes 08:00 y Miércoles 10:00)
-- SELECT EXTRACT(DOW FROM dr.Fecha)::INT AS dia, TO_CHAR(dr.HoraInicio,'HH24:MI') AS hora,
--        COUNT(*) AS reservas,
--        ROUND(COUNT(*)::NUMERIC/(SELECT COUNT(*) FROM Canchas WHERE Estado!='Mantenimiento')*100,1) AS pct_ocupacion
-- FROM DetalleReservas dr JOIN Reservas r ON r.ReservaID=dr.ReservaID
-- WHERE r.EstadoReserva IN ('Confirmada','Completada')
--   AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
-- GROUP BY dia, hora HAVING ROUND(COUNT(*)::NUMERIC/(SELECT COUNT(*) FROM Canchas WHERE Estado!='Mantenimiento')*100,1) >= 70
-- ORDER BY pct_ocupacion DESC;

-- REGLA 3 – baja demanda (debe mostrar Domingo 06:00 y Sábado 20:00)
-- SELECT EXTRACT(DOW FROM dr.Fecha)::INT AS dia, TO_CHAR(dr.HoraInicio,'HH24:MI') AS hora,
--        COUNT(*) AS reservas,
--        ROUND(COUNT(*)::NUMERIC/(SELECT COUNT(*) FROM Canchas WHERE Estado!='Mantenimiento')*100,1) AS pct_ocupacion
-- FROM DetalleReservas dr JOIN Reservas r ON r.ReservaID=dr.ReservaID
-- WHERE r.EstadoReserva IN ('Confirmada','Completada')
--   AND dr.Fecha >= CURRENT_DATE - INTERVAL '60 days'
-- GROUP BY dia, hora HAVING ROUND(COUNT(*)::NUMERIC/(SELECT COUNT(*) FROM Canchas WHERE Estado!='Mantenimiento')*100,1) <= 30
-- ORDER BY pct_ocupacion ASC;
