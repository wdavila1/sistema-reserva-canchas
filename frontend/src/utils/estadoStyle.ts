import type { ReservationStatus } from "../types/reservation/ReservationStatus";

export const estadoStyle: Record<ReservationStatus, string> = {
  confirmada: "bg-white text-emerald-600 border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
  pendiente: "bg-secondary text-white border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
  cancelada: "bg-primary text-white border-2 border-primary shadow-[2px_2px_0px_0px_#ff6b2b] font-bold px-3 py-1",
  completada: "bg-white text-primary border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
};