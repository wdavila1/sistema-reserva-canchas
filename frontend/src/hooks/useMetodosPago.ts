import { obtenerMetodosPago } from "@/services/metodos-pago.api";
import type { MetodosPago } from "@/types/pagos/MetodoPago";
import { useState, useEffect } from "react";

export function useMetodosPago() {
    const [metodosPago, setMetodosPago] = useState<MetodosPago[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerMetodosPago()
            .then(setMetodosPago)
            .finally(() => setLoading(false));
    }, []);

    return {
        metodosPago,
        loading
    };
}