import * as metodosPagoRepository from "../repository/metodos-pago.repository.js"

export async function obtenerMetodosPago(){
    return await metodosPagoRepository.obtenerMetodosPago();
}