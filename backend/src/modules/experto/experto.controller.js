import { asyncHandler } from "../../utils/asyncHandler.js";
import * as expertoService from "./experto.service.js";

// Nombres de días para respuesta legible
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/**
 * GET /experto/sugerencia-usuario
 * Retorna el horario óptimo del usuario autenticado basado en su historial.
 * Requiere token (el usuarioId viene del JWT).
 */
export const sugerenciaUsuario = asyncHandler(async (req, res) => {
  const usuarioId = req.user.userId;
  const resultado = await expertoService.obtenerHorarioOptimoUsuario(usuarioId);

  if (!resultado) {
    return res.status(200).json({
      tieneSugerencia: false,
      mensaje: "Aún no tienes suficiente historial para generar una sugerencia personalizada. ¡Haz tu primera reserva!",
    });
  }

  res.status(200).json({
    tieneSugerencia: true,
    sugerencia: {
      diaSemana: resultado.dia_semana,
      nombreDia: DIAS[resultado.dia_semana],
      horaInicio: resultado.hora_inicio,
      nombreCancha: resultado.nombre_cancha,
      tipoCancha: resultado.tipo_cancha,
      totalReservas: resultado.total_reservas,
      mensaje: `Notamos que sueles reservar los ${DIAS[resultado.dia_semana]} a las ${resultado.hora_inicio} en ${resultado.nombre_cancha}. ¡La cancha podría estar disponible!`,
    },
  });
});

/**
 * GET /experto/patrones-demanda
 * Retorna los horarios de alta demanda (>= 70% ocupación).
 * Solo administrador.
 */
export const patronesAltaDemanda = asyncHandler(async (req, res) => {
  const patrones = await expertoService.obtenerPatronesAltaDemanda();

  const resultado = patrones.map((p) => ({
    diaSemana: p.dia_semana,
    nombreDia: DIAS[p.dia_semana],
    horaInicio: p.hora_inicio,
    totalReservas: p.total_reservas,
    totalCanchas: Number(p.total_canchas),
    porcentajeOcupacion: Number(p.porcentaje_ocupacion),
    nivel: p.porcentaje_ocupacion >= 90 ? "critico" : "alto",
  }));

  res.status(200).json({
    totalHorariosPico: resultado.length,
    patrones: resultado,
  });
});

/**
 * GET /experto/sugerencias-promociones
 * Detecta horarios de baja ocupación (<= 30%) y sugiere crear una promoción.
 * Solo administrador.
 */
export const sugerenciasPromociones = asyncHandler(async (req, res) => {
  const sugerencias = await expertoService.obtenerSugerenciasPromociones();

  const resultado = sugerencias.map((s) => ({
    diaSemana: s.dia_semana,
    nombreDia: DIAS[s.dia_semana],
    horaInicio: s.hora_inicio,
    totalReservas: s.total_reservas,
    porcentajeOcupacion: Number(s.porcentaje_ocupacion),
    descuentoSugerido: s.descuento_sugerido,
    yaTienePromocion: s.ya_tiene_promocion,
    // Datos preformateados para que el admin pueda crear la promo con 1 clic
    promocionSugerida: {
      titulo: `Promo ${DIAS[s.dia_semana]} ${s.hora_inicio}`,
      porcentajeDescuento: s.descuento_sugerido,
      diaSemana: s.dia_semana,
      horaInicio: s.hora_inicio,
    },
    mensaje: `Baja ocupación detectada los ${DIAS[s.dia_semana]} a las ${s.hora_inicio} (${s.porcentaje_ocupacion}%). Se recomienda un descuento del ${s.descuento_sugerido}%.`,
  }));

  res.status(200).json({
    totalSugerencias: resultado.length,
    sugerencias: resultado,
  });
});

/**
 * GET /experto/resumen
 * Métricas generales del sistema experto para mostrar en el Dashboard.
 * Solo administrador.
 */
export const resumenExperto = asyncHandler(async (req, res) => {
  const resumen = await expertoService.obtenerResumenExperto();
  res.status(200).json(resumen);
});
