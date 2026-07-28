// Controlador del pago simulado (sin pasarela real).
// TODO: implementar.

import { asyncHandler } from "../../../utils/asyncHandler.js"
import * as pagosService from "../service/pagos.service.js"

//GET /pagos/pendientes?limit=5&page=1
export const obtenerPagosPendientes = asyncHandler(async (req, res) => {
    let { limit = 5, page = 1 } = req.query;

    limit = Math.max(Number(limit), 1);
    page = Math.max(Number(page), 1);

    const response = await pagosService.obtenerPagosPendientes(limit, page);

    res.status(200).json(response);
});

//GET /pagos/confirmados
export const obtenerPagosConfirmados = asyncHandler(async (req, res) => {
    let { limit = 5, page = 1 } = req.query;

    const facturado = req.query.facturado === undefined ? null : req.query.facturado === "true";

    limit = Math.max(Number(limit), 1);
    page = Math.max(Number(page), 1);

    const response = await pagosService.obtenerPagosConfirmados(limit, page, facturado);

    res.status(200).json(response);
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