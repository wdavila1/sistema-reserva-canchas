import { useEffect, useState } from "react";
import { getTodasLasReservas } from "../services/reservas.api";
import type { ReservaAdminResumen } from "../services/reservas.api";
import type { Paginacion } from "@/shared/types/Paginacion";


export function useReservasAdmin(initialPage = 1, initialLimit = 5, initialEstado = "Todos") {
  const [reservas, setReservas] = useState<ReservaAdminResumen[]>([]);
  const [pagination, setPagination] = useState<Paginacion>({
    page: initialPage,
    limit: initialLimit,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [estado, setEstadoState] = useState(initialEstado);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cargarReservas = async (page: number, limit: number, estadoFiltro: string) => {
    try {
      setLoading(true);
      const response = await getTodasLasReservas(page, limit, estadoFiltro);
      setReservas(response.data);
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
    cargarReservas(page, pagination.limit, estado);
  };

  const nextPage = () => {
    if (pagination.hasNextPage) goToPage(pagination.page + 1);
  };

  const prevPage = () => {
    if (pagination.hasPreviousPage) goToPage(pagination.page - 1);
  };

  const setLimit = (newLimit: number) => {
    if (newLimit === pagination.limit) return;
    cargarReservas(1, newLimit, estado);
  };

  /** Cambia el filtro de estado y vuelve a la página 1 (si te quedas en la
   * página 4 al filtrar "Cancelada" y solo hay 2 páginas, se ve vacío). */
  const setEstado = (nuevoEstado: string) => {
    setEstadoState(nuevoEstado);
    cargarReservas(1, pagination.limit, nuevoEstado);
  };

  useEffect(() => {
    cargarReservas(initialPage, initialLimit, initialEstado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reservas,
    loading,
    error,
    pagination,
    estado,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    setEstado,
    refetch: () => cargarReservas(pagination.page, pagination.limit, estado),
  };
}