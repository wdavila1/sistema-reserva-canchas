import type { DatosFacturacion } from "../types/DatosFacturacion";
import { axiosClient } from "@/shared/services/axiosClient";
import type { FacturaDetalle } from "../types/FacturaDetalle";


export const generarFactura = async(data: DatosFacturacion): Promise<number> => {
    const response = await axiosClient.post<number>("/facturas/generar",data);
    return response.data;
}

export const verFactura = async(pagoId: number): Promise<FacturaDetalle> => {
    const response = await axiosClient.get<FacturaDetalle>("/facturas/obtener", { params: { pagoId }});
    return response.data;
}