import type { ReservationStatus } from "../types/reservation/ReservationStatus";

export const estadoLabel: Record<ReservationStatus, string> = {
  confirmada: "Confirmada", pendiente: "Pendiente",
  cancelada: "Cancelada", completada: "Completada",
};
