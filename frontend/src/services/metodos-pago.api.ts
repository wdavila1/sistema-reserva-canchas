import { axiosClient } from "./axiosClient";
import type { MetodosPago } from "@/types/pagos/MetodoPago";

export const obtenerMetodosPago = async (): Promise<MetodosPago[]> => {
    const response = await axiosClient.get<MetodosPago[]>("metodos-pago/obtener/todos");
    return response.data;
};
