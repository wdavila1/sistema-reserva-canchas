import { axiosClient } from "@/shared/services/axiosClient";

// Lo que devuelve el backend (espejo del shape camelCase del service).
export interface Notificacion {
  id: number;
  usuarioId: number;
  reservaId: number | null;
  tipo: string;
  mensaje: string;
  fechaCreacion: string;
  fechaProgramada: string;
  leido: boolean;
  fechaLeido: string | null;
}

// GET /api/notificaciones — devuelve las notificaciones del usuario logueado.
export const getNotificaciones = async (): Promise<Notificacion[]> => {
  const { data } = await axiosClient.get<{ notificaciones: Notificacion[] }>("/notificaciones");
  return data.notificaciones;
};

// PATCH /api/notificaciones/:id/leida — marca una como leída.
export const marcarComoLeida = async (id: number): Promise<Notificacion> => {
  const { data } = await axiosClient.patch<{ notificacion: Notificacion }>(`/notificaciones/${id}/leida`);
  return data.notificacion;
};