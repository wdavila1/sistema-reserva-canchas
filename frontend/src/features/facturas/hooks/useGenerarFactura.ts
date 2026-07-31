import { generarFactura } from "../services/facturas.api"

export function useGenerarFactura (
    refetchPagosSinFactura: () => Promise<void>,
    refetchPagosConFactura: () => Promise<void>
){
    const generar = async (pagoId: number, rtn: string, razonSocialCliente: string, aplicaExoneracion : boolean) =>{
        await generarFactura ({pagoId, rtn, razonSocialCliente, aplicaExoneracion});

        
        await Promise.all([
            refetchPagosSinFactura(),
            refetchPagosConFactura()
        ])
    }
    return { generar }
}