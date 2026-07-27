import type { PagoConfirmado } from "@/types/pagos/PagoConfirmado";
import { axiosClient } from "./axiosClient";
import type { PagoPendiente } from "@/types/pagos/PagoPendiente";


// GET /pagos/pendientes
export const obtenerPagosPendientes = async (): Promise<PagoPendiente[]> => {
    const response = await axiosClient.get<PagoPendiente[]>("pagos/pendientes");
    return response.data;
};

//GET /pagos/confirmados
export const obtenerPagosConfirmados = async (): Promise<PagoConfirmado[]> => {
    const response = await axiosClient.get<PagoConfirmado[]>("pagos/confirmados");
    return response.data;
}