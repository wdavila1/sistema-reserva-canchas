import * as pagosRepository from "../repository/pagos.repository.js"

export async function obtenerPagosPendientes(){
    return await pagosRepository.obtenerPagosPendientes();
}

export async function obtenerPagosConfirmados() {
    return await pagosRepository.obtenerPagosConfirmados();
}