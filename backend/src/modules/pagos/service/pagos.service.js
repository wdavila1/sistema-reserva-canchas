import * as pagosRepository from "../repository/pagos.repository.js";
import * as reservasRepository from "../../reservas/reservas.repository.js";
import * as metodoPagoRepository from "../repository/metodos-pago.repository.js";

import { ApiError } from "../../../utils/ApiError.js";

export async function obtenerPagosPendientes(limit, page) {
  const offset = (page - 1) * limit;

  const result = await pagosRepository.obtenerPagosPendientes(limit, offset);

  const totalItems = result.length > 0 ? Number(result[0].totalregistros) : 0;

  const data = result.map(({ totalregistros, ...pago }) => pago);

  const totalPages = Math.ceil(totalItems / limit);

  const pagination = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { data, pagination };
}

export async function obtenerPagosConfirmados(limit, page) {
  const offset = (page - 1) * limit;

  const result = await pagosRepository.obtenerPagosConfirmados(limit, offset);

  const totalItems = result.length > 0 ? Number(result[0].totalregistros) : 0;

  const data = result.map(({ totalregistros, ...pago }) => pago);

  const totalPages = Math.ceil(totalItems / limit);

  const pagination = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { data, pagination };
}

export async function registrarPago(detallesPago) {
  const { reservaId, metodoPagoId } = detallesPago;

  if (!reservaId || !metodoPagoId) {
    throw new ApiError(400, "Todos los campos son obligatorios");
  }

  const reserva = await reservasRepository.obtenerEncabezadoReserva(reservaId);

  if (!reserva) {
    throw new ApiError(404, "La reserva no existe");
  }

  const metodoPago =
    await metodoPagoRepository.obtenerMetodoPagoPorId(metodoPagoId);

  if (!metodoPago) {
    throw new ApiError(404, "El método de pago no existe");
  }

  if (reserva.estadoreserva !== "Pendiente") {
    throw new ApiError(409, "Esta reserva ya fue pagada o cancelada");
  }

  const monto = Number(reserva.total);

  if (!monto || monto <= 0) {
    throw new ApiError(400, "La reserva no tiene un total válido");
  }

  const pagoId = await pagosRepository.registrarPago(
    reservaId,
    metodoPagoId,
    monto,
  );

  await reservasRepository.actualizarEstadoReserva(reservaId, "Confirmada");

  return pagoId;
}
