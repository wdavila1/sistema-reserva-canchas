import type { Reservacion } from "@/features/reservas/types/Reservacion";

export const RESERVACIONES: Reservacion[] = [
  {
    id: "RES-2026-001", canchaId: 1, cancha: "Cancha Fútbol 5 — Norte",
    usuario: "Carlos Mejía", email: "cmejia@gmail.com", telefono: "+504 9876-5432",
    fecha: "2026-06-24", horaInicio: "18:00", horaFin: "19:00", horas: 1,
    estado: "confirmada", subtotal: 350, isv: 52.50, total: 402.50, pagado: true, metodoPago: "Tarjeta",
  },
  {
    id: "RES-2026-002", canchaId: 3, cancha: "Cancha de Baloncesto",
    usuario: "Ana Rodríguez", email: "arodriguez@hotmail.com", telefono: "+504 3421-9876",
    fecha: "2026-06-24", horaInicio: "16:00", horaFin: "18:00", horas: 2,
    estado: "confirmada", subtotal: 560, isv: 84.00, total: 644.00, pagado: true, metodoPago: "Transferencia",
  },
  {
    id: "RES-2026-003", canchaId: 2, cancha: "Cancha Fútbol 5 — Sur",
    usuario: "Marco Torres", email: "mtorres@yahoo.com", telefono: "+504 8765-4321",
    fecha: "2026-06-25", horaInicio: "20:00", horaFin: "21:00", horas: 1,
    estado: "pendiente", subtotal: 450, isv: 67.50, total: 517.50, pagado: false,
  },
  {
    id: "RES-2026-004", canchaId: 5, cancha: "Cancha de Tenis — A",
    usuario: "Laura Suárez", email: "lsuarez@gmail.com", telefono: "+504 9234-5678",
    fecha: "2026-06-23", horaInicio: "08:00", horaFin: "10:00", horas: 2,
    estado: "completada", subtotal: 640, isv: 96.00, total: 736.00, pagado: true, metodoPago: "Efectivo",
  },
  {
    id: "RES-2026-005", canchaId: 1, cancha: "Cancha Fútbol 5 — Norte",
    usuario: "Diego Flores", email: "dflores@gmail.com", telefono: "+504 7654-3210",
    fecha: "2026-06-22", horaInicio: "19:00", horaFin: "20:00", horas: 1,
    estado: "cancelada", subtotal: 350, isv: 52.50, total: 402.50, pagado: false,
  },
  {
    id: "RES-2026-006", canchaId: 4, cancha: "Cancha de Voleibol",
    usuario: "Sofía Martínez", email: "smartinez@gmail.com", telefono: "+504 8901-2345",
    fecha: "2026-06-26", horaInicio: "15:00", horaFin: "17:00", horas: 2,
    estado: "confirmada", subtotal: 440, isv: 66.00, total: 506.00, pagado: true, metodoPago: "Tarjeta",
  },
];