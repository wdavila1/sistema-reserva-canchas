import * as promocionesRepository from "./promociones.repository.js";
import { ApiError } from "../../utils/ApiError.js";

// Listar todas las promociones (admin)
export async function obtenerTodasLasPromociones() {
  return await promocionesRepository.obtenerTodasLasPromociones();
}

// Listar solo activas (para uso interno del sistema)
export async function obtenerPromocionesActivas() {
  return await promocionesRepository.obtenerPromocionesActivas();
}

// Obtener una por ID
export async function obtenerPromocionPorId(promocionId) {
  const promo = await promocionesRepository.obtenerPromocionPorId(promocionId);
  if (!promo) throw new ApiError(404, "Promoción no encontrada.");
  return promo;
}

// Crear una nueva promoción con validaciones
export async function crearPromocion(datos) {
  const { titulo, porcentajeDescuento, horaInicio, horaFin } = datos;

  if (!titulo || !porcentajeDescuento) {
    throw new ApiError(400, "El título y el porcentaje de descuento son obligatorios.");
  }

  if (horaInicio && horaFin && horaFin <= horaInicio) {
    throw new ApiError(400, "La hora de fin debe ser posterior a la hora de inicio.");
  }

  return await promocionesRepository.crearPromocion(datos);
}

// Actualizar una promoción
export async function actualizarPromocion(promocionId, datos) {
  const existe = await promocionesRepository.obtenerPromocionPorId(promocionId);
  if (!existe) throw new ApiError(404, "Promoción no encontrada.");

  const { horaInicio, horaFin } = datos;
  if (horaInicio && horaFin && horaFin <= horaInicio) {
    throw new ApiError(400, "La hora de fin debe ser posterior a la hora de inicio.");
  }

  return await promocionesRepository.actualizarPromocion(promocionId, datos);
}

// Desactivar una promoción (soft delete)
export async function eliminarPromocion(promocionId) {
  const existe = await promocionesRepository.obtenerPromocionPorId(promocionId);
  if (!existe) throw new ApiError(404, "Promoción no encontrada.");
  return await promocionesRepository.eliminarPromocion(promocionId);
}

/**
 * Función CLAVE usada por reservas.service.js al crear una reserva.
 * Busca si existe una promoción activa para la fecha y hora dadas.
 * Retorna el objeto de la promoción o null si no hay ninguna.
 */
export async function buscarPromocionAplicable(fecha, horaInicio) {
  return await promocionesRepository.buscarPromocionAplicable(fecha, horaInicio);
}
