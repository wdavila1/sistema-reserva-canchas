import * as metodosPagoService from "../service/metodos-pago.service.js"

// GET /obtener/todos
export const obtenerMetodosPago = asyncHandler(async (req, res) =>{
    const metodosPago = await metodosPagoService.obtenerMetodosPago();
    res.status(200).json(metodosPago);
})
