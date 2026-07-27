import { useEffect, useState } from "react";
import { obtenerPagosPendientes } from "@/services/pagos.api";
import type { PagoPendiente } from "@/types/pagos/PagoPendiente";

export function usePagosPendientes() {
    const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarPagos = async () => {
        try {
            setLoading(true);
            const data = await obtenerPagosPendientes();
            setPagosPendientes(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPagos();
    }, []);

    return {
        pagosPendientes,
        loading,
        error,
        refetch: cargarPagos,
    };
}