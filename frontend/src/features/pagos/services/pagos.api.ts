import { axiosClient } from "@/shared/services/axiosClient";

import type { RegistroPago } from "../types/RegistroPago";
import type { ConfirmacionPago } from "../types/ConfirmacionPago";
import type { PagoPendienteResponse } from "../types/PagoPendienteResponse";
import type { PagoConfirmadoResponse } from "../types/PagosConfirmadosResponse";

// GET /pagos/pendientes
export const obtenerPagosPendientes = async (page : number = 1, limit : number = 5): Promise<PagoPendienteResponse> => {
  const response = await axiosClient.get<PagoPendienteResponse>("pagos/pendientes", { params: { page, limit }, });
  return response.data;
};

//GET /pagos/confirmados
export const obtenerPagosConfirmados = async (page : number = 1, limit : number = 5, facturado : boolean | null) : Promise<PagoConfirmadoResponse> => {
  const response = await axiosClient.get<PagoConfirmadoResponse>("pagos/confirmados", { params: { page, limit, facturado },});
  return response.data; 
};

//POST /pagos/registrar
export const registrarPago = async (data: RegistroPago): Promise<ConfirmacionPago> => {
  const response = await axiosClient.post<ConfirmacionPago>("pagos/registrar", data);
  return response.data;
}