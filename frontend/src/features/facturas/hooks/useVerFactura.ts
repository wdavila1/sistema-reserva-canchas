import { useEffect, useState, useRef, useCallback } from "react";
import type { FacturaDetalle } from "../types/FacturaDetalle";
import { verFactura } from "../services/facturas.api";

export function useVerFactura(pagoId: number | null) {
    const [factura, setFactura] = useState<FacturaDetalle | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const obtenerFactura = useCallback(async (id: number) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await verFactura(id);
            if (isMounted.current) {
                setFactura(response);
                setError(null);
            }
        } catch (err) {
            if (isMounted.current) {
                const errorObj = err instanceof Error ? err : new Error(String(err));
                setError(errorObj);
                setFactura(null);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!pagoId) {
            setFactura(null);
            setLoading(false);
            setError(null);
            return;
        }
        obtenerFactura(pagoId);
    }, [pagoId, obtenerFactura]);

    return { factura, loading, error };
}