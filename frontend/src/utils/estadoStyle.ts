import type { ReservationStatus } from "../types/reservation/ReservationStatus";

export const estadoStyle: Record<ReservationStatus, string> = {
  confirmada: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-amber-100 text-amber-700",
  cancelada: "bg-red-100 text-red-600",
  completada: "bg-slate-100 text-slate-600",
};