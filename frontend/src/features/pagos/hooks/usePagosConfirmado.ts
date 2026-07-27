import { obtenerPagosConfirmados } from "@/features/pagos/services/pagos.api";
import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";
import { useState, useEffect } from "react";

export function usePagosConfirmados() {
    const [pagosConfirmados, setPagosConfirmados] = useState<PagoConfirmado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarPagos = async () => {
        try {
            setLoading(true);
            const data = await obtenerPagosConfirmados();
            setPagosConfirmados(data);
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
        pagosConfirmados,
        loading,
        error,
        refetch: cargarPagos,
    };
}