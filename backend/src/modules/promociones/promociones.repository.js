import { pool } from "../../config/db.js";

// Obtener todas las promociones (para el admin)
export async function obtenerTodasLasPromociones() {
  const { rows } = await pool.query(
    `SELECT PromocionID, Titulo, Descripcion, PorcentajeDescuento,
            DiaSemana, HoraInicio, HoraFin, Estado, FechaCreacion
       FROM Promociones
      ORDER BY FechaCreacion DESC`
  );
  return rows;
}

// Obtener solo las promociones activas
export async function obtenerPromocionesActivas() {
  const { rows } = await pool.query(
    `SELECT PromocionID, Titulo, Descripcion, PorcentajeDescuento,
            DiaSemana, HoraInicio, HoraFin
       FROM Promociones
      WHERE Estado = TRUE`
  );
  return rows;
}

// Obtener una promoción por ID
export async function obtenerPromocionPorId(promocionId) {
  const { rows } = await pool.query(
    `SELECT PromocionID, Titulo, Descripcion, PorcentajeDescuento,
            DiaSemana, HoraInicio, HoraFin, Estado, FechaCreacion
       FROM Promociones
      WHERE PromocionID = $1`,
    [promocionId]
  );
  return rows[0] || null;
}

// Crear una nueva promoción
export async function crearPromocion({ titulo, descripcion, porcentajeDescuento, diaSemana, horaInicio, horaFin }) {
  const { rows } = await pool.query(
    `INSERT INTO Promociones (Titulo, Descripcion, PorcentajeDescuento, DiaSemana, HoraInicio, HoraFin)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING PromocionID, Titulo, PorcentajeDescuento, DiaSemana, HoraInicio, HoraFin, Estado`,
    [titulo, descripcion ?? null, porcentajeDescuento, diaSemana ?? null, horaInicio ?? null, horaFin ?? null]
  );
  return rows[0];
}

// Actualizar una promoción existente
export async function actualizarPromocion(promocionId, { titulo, descripcion, porcentajeDescuento, diaSemana, horaInicio, horaFin, estado }) {
  const { rows } = await pool.query(
    `UPDATE Promociones
        SET Titulo              = COALESCE($2, Titulo),
            Descripcion         = COALESCE($3, Descripcion),
            PorcentajeDescuento = COALESCE($4, PorcentajeDescuento),
            DiaSemana           = $5,
            HoraInicio          = $6,
            HoraFin             = $7,
            Estado              = COALESCE($8, Estado)
      WHERE PromocionID = $1
      RETURNING PromocionID, Titulo, PorcentajeDescuento, DiaSemana, HoraInicio, HoraFin, Estado`,
    [promocionId, titulo, descripcion, porcentajeDescuento, diaSemana ?? null, horaInicio ?? null, horaFin ?? null, estado]
  );
  return rows[0] || null;
}

// Eliminar (desactivar) una promoción
export async function eliminarPromocion(promocionId) {
  const { rows } = await pool.query(
    `UPDATE Promociones SET Estado = FALSE WHERE PromocionID = $1 RETURNING PromocionID`,
    [promocionId]
  );
  return rows[0] || null;
}

/**
 * Busca si existe una promoción activa que coincida con la fecha y hora de un bloque.
 * - Compara el día de la semana (0=Domingo ... 6=Sábado) con DiaSemana (NULL = todos los días).
 * - Compara la hora de inicio con el rango HoraInicio–HoraFin.
 * Retorna la primera coincidencia (mayor descuento si hay varias).
 */
export async function buscarPromocionAplicable(fecha, horaInicio) {
  const { rows } = await pool.query(
    `SELECT PromocionID, Titulo, PorcentajeDescuento
       FROM Promociones
      WHERE Estado = TRUE
        AND (DiaSemana IS NULL OR DiaSemana = EXTRACT(DOW FROM $1::DATE))
        AND (HoraInicio IS NULL OR $2::TIME >= HoraInicio)
        AND (HoraFin    IS NULL OR $2::TIME <  HoraFin)
      ORDER BY PorcentajeDescuento DESC
      LIMIT 1`,
    [fecha, horaInicio]
  );
  return rows[0] || null;
}
