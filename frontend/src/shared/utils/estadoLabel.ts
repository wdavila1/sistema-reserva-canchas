import type { ReservationStatus } from "@/features/reservas/types/ReservationStatus"

export const estadoLabel: Record<ReservationStatus, string> = {
  confirmada: "Confirmada", pendiente: "Pendiente",
  cancelada: "Cancelada", completada: "Completada",
};
