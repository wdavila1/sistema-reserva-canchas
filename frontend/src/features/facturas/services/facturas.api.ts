import type { DatosFacturacion } from "../types/DatosFacturacion";
import { axiosClient } from "@/shared/services/axiosClient";
import type { FacturaDetalle } from "../types/FacturaDetalle";


export const generarFactura = async(data: DatosFacturacion): Promise<FacturaDetalle> => {
    const response = await axiosClient.post<FacturaDetalle>("/facturas/generar",data);
    return response.data;
}