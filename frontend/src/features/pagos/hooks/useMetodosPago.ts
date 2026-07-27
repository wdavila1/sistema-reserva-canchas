import { useEffect, useState } from "react";
import { obtenerMetodosPago } from "@/features/pagos/services/metodos-pago.api";

export interface MetodoPago {
    metodopagoid: number;
    metodopago: string;
}

export function useMetodosPago() {
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarMetodosPago = async () => {
            try {
                const data = await obtenerMetodosPago();
                setMetodosPago(data);
            } catch (error) {
                setError("Error al cargar métodos de pago");
            } finally {
                setLoading(false);
            }
        };

        cargarMetodosPago();
    }, []);

    return {
        metodosPago,
        loading,
        error
    };
}