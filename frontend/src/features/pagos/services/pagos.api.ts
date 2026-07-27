import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";
import { axiosClient } from "@/shared/services/axiosClient";
import type { PagoPendiente } from "@/features/pagos/types/PagoPendiente";


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