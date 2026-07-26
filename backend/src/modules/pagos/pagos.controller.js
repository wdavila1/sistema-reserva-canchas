// Controlador del pago simulado (sin pasarela real).
// TODO: implementar.

import { asyncHandler } from "../../utils/asyncHandler.js";
import * as pagosService from "./pagos.service.js"

//GET /pagos/pendientes
export const obtenerPagosPendientes = asyncHandler(async (req, res) =>{
    const pagosPendientes = await pagosService.obtenerPagosPendientes();

    res.status(200).json(pagosPendientes);
})
