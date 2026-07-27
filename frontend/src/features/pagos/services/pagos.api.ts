import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";
import { axiosClient } from "@/shared/services/axiosClient";

import type { PagoPendiente } from "@/features/pagos/types/PagoPendiente";
import type { RegistroPago } from "../types/RegistroPago";
import type { ConfirmacionPago } from "../types/ConfirmacionPago";

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

//POST /pagos/registrar
export const registrarPago = async (data: RegistroPago): Promise<ConfirmacionPago> => {
  const response = await axiosClient.post<ConfirmacionPago>("pagos/registrar", data);
  return response.data;
}