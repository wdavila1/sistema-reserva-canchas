import { generarFactura } from "../services/facturas.api"

export function useGenerarFactura (
    refetchPagosSinFactura: () => Promise<void>,
    refetchPagosConFactura: () => Promise<void>
){
    const generar = async (pagoId: number, rtn: string, razonSocialCliente: string) =>{
        await generarFactura ({pagoId, rtn, razonSocialCliente});

        
        await Promise.all([
            refetchPagosSinFactura(),
            refetchPagosConFactura()
        ])
    }
    return { generar }
}