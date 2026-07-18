import type { ReservationStatus } from "../types/reservation/ReservationStatus";

export const estadoStyle: Record<ReservationStatus, string> = {
  confirmada: "!bg-[#ccff00] !text-primary border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
  pendiente: "bg-secondary text-white border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
  cancelada: "!bg-destructive text-white border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
  completada: "bg-primary !text-white border-2 border-primary shadow-[2px_2px_0px_0px_#0b1f3a] font-bold px-3 py-1",
};