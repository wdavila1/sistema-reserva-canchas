import { axiosClient } from "./axiosClient";
import type { PagoPendiente } from "@/types/pagos/PagoPendiente";

export const obtenerPagosPendientes = async (): Promise<PagoPendiente[]> => {
    const response = await axiosClient.get<PagoPendiente[]>("pagos/pendientes");
    return response.data;
};