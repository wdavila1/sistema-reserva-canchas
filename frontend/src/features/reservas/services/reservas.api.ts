import { axiosClient } from "@/shared/services/axiosClient";
import type { Paginacion } from "@/shared/types/Paginacion";

export type EstadoReserva = "Pendiente" | "Confirmada" | "Cancelada" | "Completada";

/* Lo que se manda al crear una reserva -- un arreglo porque el backend soporta reservar varios bloques (canchas/horarios) en una sola petición. */
export interface BloqueReservaInput {
  canchaId: number;
  fecha: string; // formatos que manejamos "YYYY-MM-DD"
  horaInicio: string; // "HH:MM"
  horaFin: string; // "HH:MM"
}

/* Un bloque tal como lo devuelve el backend (reservas.service.js agruparReserva/agruparListado). */
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

/** Una reserva completa (encabezado y sus bloques). */
export interface Reserva {
  reservaId: number;
  usuarioId: number;
  cliente?: {
    primerNombre: string;
    primerApellido: string;
    correo: string;
  };
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

// Fila de la tabla del admin -- viene ya agrupada por reserva desde SQL, fechas y canchas son cadenass separadas por comas y las horas de inicio y fin el rango de aceracion

export interface ReservaAdminResumen {
  reservaId: number;
  usuarioId: number;
  estadoReserva: EstadoReserva;
  total: number;
  fechaReserva: string;
  fechaModificacion: string | null;
  cliente: { primerNombre: string; primerApellido: string; correo: string };
  canchas: string;
  fechas: string;
  horaInicio: string;
  horaFin: string;
}

export interface ReservasAdminResponse {
  data: ReservaAdminResumen[];
  pagination: Paginacion;
}

/** GET /api/reservas -- solo admin, paginado (mismo patrón que
 * obtenerPagosPendientes/obtenerPagosConfirmados en el módulo de pagos). */
export async function getTodasLasReservas(
  page = 1,
  limit = 5,
  estado?: string
): Promise<ReservasAdminResponse> {
  const { data } = await axiosClient.get<ReservasAdminResponse>("/reservas", {
    params: { page, limit, estado: estado && estado !== "Todos" ? estado : undefined },
  });
  return data;
}

/* PATCH /api/reservas/:id/estado -- solo admin. Para cancelar usar cancelarReserva(), no esta función. */
export async function actualizarEstadoReserva(
  reservaId: number,
  estado: Exclude<EstadoReserva, "Cancelada">
): Promise<Reserva> {
  const { data } = await axiosClient.patch<{ reserva: Reserva }>(`/reservas/${reservaId}/estado`, { estado });
  return data.reserva;
}