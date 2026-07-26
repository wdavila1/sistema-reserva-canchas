import * as pagosRepository from "./pagos.repository.js"

export async function obtenerPagosPendientes(){
    return await pagosRepository.obtenerPagosPendientes();
}