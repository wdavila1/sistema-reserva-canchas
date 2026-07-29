import { useEffect, useState } from "react";
import { obtenerPagosConfirmados } from "../services/pagos.api";
import type { Paginacion } from "@/shared/types/Paginacion";
import type { PagoConfirmado } from "../types/PagoConfirmado";

export function usePagosConfirmados(initialPage = 1, initialLimit = 5, initialFacturado: boolean | null = null) {
    const [pagosConfirmados, setPagosConfirmados] = useState<PagoConfirmado[]>([]);
    const [pagination, setPagination] = useState<Paginacion>({
        page: initialPage,
        limit: initialLimit,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [facturado, setFacturado] = useState<boolean | null>(initialFacturado);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarPagos = async (page: number = pagination.page, limit: number = pagination.limit) => {
        try {
            setLoading(true);
            const response = await obtenerPagosConfirmados(page, limit, facturado)
            setPagosConfirmados(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;
        cargarPagos(page);
    };

    const nextPage = () => {
        if (pagination.hasNextPage) goToPage(pagination.page + 1);
    };

    const prevPage = () => {
        if (pagination.hasPreviousPage) goToPage(pagination.page - 1);
    };

    const setLimit = (newLimit: number) => {
        if (newLimit === pagination.limit) return;
        cargarPagos(1, newLimit);
    };

    useEffect(() => { cargarPagos(1, initialLimit); }, [facturado]);

    return {
        pagosConfirmados,
        loading,
        error,
        pagination,
        goToPage,
        nextPage,
        prevPage,
        setLimit,
        facturado,
        setFacturado,
        refetch: () => cargarPagos(pagination.page),
    };
}