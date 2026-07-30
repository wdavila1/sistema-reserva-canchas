import { useEffect, useState } from "react";
import type { FacturaDetalle } from "../types/FacturaDetalle";
import { verFactura } from "../services/facturas.api";

export function useVerFactura(pagoId: number) {
    const [factura, setFactura] = useState<FacturaDetalle>({
        facturaid: 0,
        razonsocial: "",
        rtnempresa: "",
        direccion: "",
        cai: "",
        rangoautorizado: "",
        fechafin: "",
        numerofactura: "",
        fechaemision: "",
        rtncliente: "",
        servicioadquirido: "",
        subtotal: "",
        isv: "",
        exonercacion: "",
        total: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const obtenerFactura = async (pagoId: number) => {
        try {
            setLoading(true);
            const response = await verFactura(pagoId);
            setFactura(response);
            setError(null);
        }
        catch (err) {
            setError(err as Error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        obtenerFactura(pagoId);
    }, []);

    return {
        factura,
        loading,
        error
    }

}