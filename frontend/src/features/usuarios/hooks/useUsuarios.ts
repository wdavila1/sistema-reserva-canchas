import { useEffect, useState } from "react";
import { getUsuarios } from "@/features/usuarios/services/usuarios.api";
import type { Usuario } from "@/features/usuarios/services/usuarios.api";
import type { Paginacion } from "@/shared/types/Paginacion";

export function useUsuarios(initialPage = 1, initialLimit = 10) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pagination, setPagination] = useState<Paginacion>({
    page: initialPage,
    limit: initialLimit,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [rolId, setRolId] = useState<number | undefined>(undefined);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cargarUsuarios = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = await getUsuarios({ page, limit, rolId, busqueda: busqueda || undefined });
      setUsuarios(response.data);
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
    cargarUsuarios(page, pagination.limit);
  };

  const nextPage = () => {
    if (pagination.hasNextPage) goToPage(pagination.page + 1);
  };

  const prevPage = () => {
    if (pagination.hasPreviousPage) goToPage(pagination.page - 1);
  };

  const setLimit = (newLimit: number) => {
    if (newLimit === pagination.limit) return;
    cargarUsuarios(1, newLimit);
  };

  // Se vuelve a cargar desde la página 1 cada vez que cambia el filtro de rol o la búsqueda.
  useEffect(() => {
    cargarUsuarios(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolId, busqueda]);

  return {
    usuarios,
    loading,
    error,
    pagination,
    rolId,
    setRolId,
    busqueda,
    setBusqueda,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    refetch: () => cargarUsuarios(pagination.page, pagination.limit),
  };
}