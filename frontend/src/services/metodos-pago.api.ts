import { axiosClient } from "./axiosClient";
import type { MetodoPago } from "@/types/pagos/MetodoPago";

export const obtenerMetodosPago = async (): Promise<MetodoPago[]> => {
    const response = await axiosClient.get<MetodoPago[]>("metodos-pago/obtener/todos");
    return response.data;
};
