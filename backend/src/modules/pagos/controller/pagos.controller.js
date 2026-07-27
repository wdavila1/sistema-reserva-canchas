// Controlador del pago simulado (sin pasarela real).
// TODO: implementar.

import { asyncHandler } from "../../../utils/asyncHandler.js"
import * as pagosService from "../service/pagos.service.js"

//GET /pagos/pendientes
export const obtenerPagosPendientes = asyncHandler(async (req, res) => {
    const pagosPendientes = await pagosService.obtenerPagosPendientes();

    res.status(200).json(pagosPendientes);
})

//GET /pagos/confirmados
export const obtenerPagosConfirmados = asyncHandler(async (req, res) => {
    const pagosCompletados = await pagosService.obtenerPagosConfirmados();

    res.status(200).json(pagosCompletados);
})


//POST /pagos/registrar-pago
export const registrarPago = asyncHandler(async (req, res) => {
    const detallesPago = req.body;
    const pagoId = await pagosService.registrarPago(detallesPago);

    res.status(201).json({
        mensaje: "Pago registrado correctamente",
        pagoid: pagoId
    });
});