import { axiosClient } from "./axiosClient";
import type { PagosPendientes } from "@/types/pagos/PagosPendientes";

export const obtenerPagosPendientes = async (): Promise<PagosPendientes[]> => {
    const response = await axiosClient.get<PagosPendientes[]>("/pendientes");
    return response.data;
};