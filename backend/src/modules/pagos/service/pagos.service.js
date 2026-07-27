import * as pagosRepository from "../repository/pagos.repository.js"
import * as reservasRepository from "../../reservas/reservas.repository.js"
import * as metodoPagoRepository from "../repository/metodos-pago.repository.js"

import { ApiError } from "../../../utils/ApiError.js"

export async function obtenerPagosPendientes() {
    return await pagosRepository.obtenerPagosPendientes();
}

export async function obtenerPagosConfirmados() {
    return await pagosRepository.obtenerPagosConfirmados();
}

export async function registrarPago(detallesPago) {
    const { reservaId, metodoPagoId, monto } = detallesPago;

    if (!reservaId || !metodoPagoId || !monto) {
        throw new ApiError(400, "Todos los campos son obligatorios");
    }

    if (monto <= 0) {
        throw new ApiError(400, "El monto debe ser mayor a 0");
    }

    const reserva = await reservasRepository.obtenerEncabezadoReserva(reservaId)

    if (!reserva) {
        throw new ApiError(404, "La reserva no existe");
    }

    const metodoPago = await metodoPagoRepository.obtenerMetodoPagoPorId(metodoPagoId);

    if (!metodoPago) {
        throw new ApiError(404, "El método de pago no existe");
    }

    if (reserva.estadoreserva !== 'Pendiente') {
        throw new ApiError(409, "Esta reserva ya fue pagada o cancelada");
    }

    const pagoId = await pagosRepository.registrarPago(detallesPago);

    await reservasRepository.actualizarEstadoReserva(reservaId, 'Confirmada');

    return pagoId;
}