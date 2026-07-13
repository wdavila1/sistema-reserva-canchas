import type { ReservationStatus } from "./ReservationStatus";

export interface Reservacion {
  id: string;
  canchaId: number;
  cancha: string;
  usuario: string;
  email: string;
  telefono: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  horas: number;
  estado: ReservationStatus;
  subtotal: number;
  isv: number;
  total: number;
  pagado: boolean;
  metodoPago?: string;
}
