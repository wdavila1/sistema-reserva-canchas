import { useEffect, useState } from "react";
import { obtenerPagosPendientes } from "@/features/pagos/services/pagos.api";
import type { PagoPendiente } from "@/features/pagos/types/PagoPendiente";
import type { Paginacion } from "@/shared/types/Paginacion";

export function usePagosPendientes(initialPage = 1, initialLimit = 5) {
    const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([]);
    const [pagination, setPagination] = useState<Paginacion>({
        page: initialPage,
        limit: initialLimit,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const cargarPagos = async (page: number = pagination.page, limit: number = pagination.limit) => {
        try {
            setLoading(true);
            const response = await obtenerPagosPendientes(page, limit);
            setPagosPendientes(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    // Para cambiar de página
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

    useEffect(() => {
        cargarPagos(initialPage, initialLimit);
    }, []);

    return {
        pagosPendientes,
        loading,
        error,
        pagination,
        goToPage,
        nextPage,
        prevPage,
        refetch: () => cargarPagos(pagination.page),
    };
}