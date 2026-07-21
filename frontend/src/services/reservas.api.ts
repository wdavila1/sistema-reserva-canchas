import { axiosClient } from "./axiosClient";

/* Debe calzar exactamente con el CHECK de EstadoReserva en db.sql. */
export type EstadoReserva = "Pendiente" | "Confirmada" | "Cancelada" | "Completada";

/* Lo que se manda al crear una reserva -- un arreglo porque el backend soporta reservar varios bloques (canchas/horarios) en una sola petición. */
export interface BloqueReservaInput {
  canchaId: number;
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
}

/* Un bloque tal como lo devuelve el backend (reservas.service.js -> agruparReserva/agruparListado). */
export interface BloqueReserva {
  detalleReservaId: number;
  canchaId: number;
  nombreCancha: string;
  nombreTipo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precioHora: number;
  subtotal: number;
}

/** Una reserva completa (encabezado + sus bloques). */
export interface Reserva {
  reservaId: number;
  usuarioId: number;
  fechaReserva: string;
  estadoReserva: EstadoReserva;
  total: number;
  fechaModificacion: string | null;
  bloques: BloqueReserva[];
}

/** POST /api/reservas
 * El usuarioId NO se manda -- el backend lo saca del token (req.user). */
export async function crearReserva(bloques: BloqueReservaInput[]): Promise<Reserva> {
  const { data } = await axiosClient.post<{ reserva: Reserva }>("/reservas", { bloques });
  return data.reserva;
}

/** GET /api/reservas/mias  reservas del usuario logueado. */
export async function getMisReservas(): Promise<Reserva[]> {
  const { data } = await axiosClient.get<{ reservas: Reserva[] }>("/reservas/mias");
  return data.reservas;
}

/* GET /api/reservas/:id */
export async function getReservaPorId(reservaId: number): Promise<Reserva> {
  const { data } = await axiosClient.get<{ reserva: Reserva }>(`/reservas/${reservaId}`);
  return data.reserva;
}

/* DELETE /api/reservas/:id (cancelar) */
export async function cancelarReserva(reservaId: number): Promise<Reserva> {
  const { data } = await axiosClient.delete<{ reserva: Reserva }>(`/reservas/${reservaId}`);
  return data.reserva;
}

/* GET /api/reservas -- solo admin. */
export async function getTodasLasReservas(): Promise<Reserva[]> {
  const { data } = await axiosClient.get<{ reservas: Reserva[] }>("/reservas");
  return data.reservas;
}

/* PATCH /api/reservas/:id/estado -- solo admin. Para cancelar usar cancelarReserva(), no esta función. */
export async function actualizarEstadoReserva(
  reservaId: number,
  estado: Exclude<EstadoReserva, "Cancelada">
): Promise<Reserva> {
  const { data } = await axiosClient.patch<{ reserva: Reserva }>(`/reservas/${reservaId}/estado`, { estado });
  return data.reserva;
}

