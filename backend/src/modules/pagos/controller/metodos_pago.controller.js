
// GET /obtener/todos
export const obtenerMetodosPago = asyncHandler(async (req, res) =>{
    const metodosPago = await pagosService.obtenerPagosPendientes();

    res.status(200).json(pagosPendientes);
})
