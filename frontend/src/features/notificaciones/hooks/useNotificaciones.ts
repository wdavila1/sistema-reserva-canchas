import { useState, useEffect, useCallback } from "react";
import { getNotificaciones, marcarComoLeida, type Notificacion } from "../services/notificaciones.api";

// Polling cada 30 segundos para refrescar la campanita.
const POLLING_MS = 30_000;

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar las notificaciones.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, POLLING_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const noLeidas = notificaciones.filter((n) => !n.leido).length;

  const marcarLeida = async (id: number) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true, fechaLeido: new Date().toISOString() } : n))
    );
    try {
      await marcarComoLeida(id);
    } catch (err) {
      fetchAll();
    }
  };

  return { notificaciones, noLeidas, isLoading, error, marcarLeida, refetch: fetchAll };
}