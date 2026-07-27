import { axiosClient } from "@/services/axiosClient";
import type { MetodoPago } from "@/features/pagos/types/MetodoPago";

export const obtenerMetodosPago = async (): Promise<MetodoPago[]> => {
    const response = await axiosClient.get<MetodoPago[]>("metodos-pago/obtener/todos");
    return response.data;
};
