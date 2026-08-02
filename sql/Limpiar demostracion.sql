-- 
-- Liumpiar – Revertir el seed de demostración del sistema experto
-- 
-- Elimina ÚNICAMENTE las reservas y detalles insertados por
-- Demostracion experto.sql. No toca ningún otro dato del sistema.
--
-- SEGURO DE EJECUTAR: usa una transacción y solo borra reservas con
-- Total = 150.00 y sin factura asociada.
-- 

BEGIN;

-- Paso 1: Eliminar DetalleReservas de las reservas de prueba
DELETE FROM DetalleReservas
WHERE ReservaID IN (
  SELECT ReservaID FROM Reservas
  WHERE Total = 150.00
    AND EstadoReserva IN ('Confirmada', 'Completada', 'Pendiente')
    AND NOT EXISTS (
      SELECT 1 FROM Facturas f WHERE f.ReservaID = Reservas.ReservaID
    )
    AND NOT EXISTS (
      SELECT 1 FROM Pagos p WHERE p.ReservaID = Reservas.ReservaID
    )
);

-- Paso 2: Eliminar las Reservas de prueba
DELETE FROM Reservas
WHERE Total = 150.00
  AND EstadoReserva IN ('Confirmada', 'Completada', 'Pendiente')
  AND NOT EXISTS (
    SELECT 1 FROM Facturas f WHERE f.ReservaID = Reservas.ReservaID
  )
  AND NOT EXISTS (
    SELECT 1 FROM Pagos p WHERE p.ReservaID = Reservas.ReservaID
  );

COMMIT;

-- Verificar que quedó limpio:
-- SELECT COUNT(*) FROM Reservas WHERE Total = 150.00;
-- SELECT COUNT(*) FROM DetalleReservas;
