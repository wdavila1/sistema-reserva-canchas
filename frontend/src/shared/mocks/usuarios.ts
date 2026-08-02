import type { UserAccount } from "@/features/auth/types/UserAccount";

export const USUARIOS: UserAccount[] = [
  { id: 1, nombre: "Carlos Mejía", email: "cmejia@gmail.com", telefono: "+504 9876-5432", rol: "cliente", fechaRegistro: "2026-01-15", totalReservas: 12 },
  { id: 2, nombre: "Ana Rodríguez", email: "arodriguez@hotmail.com", telefono: "+504 3421-9876", rol: "cliente", fechaRegistro: "2026-02-08", totalReservas: 7 },
  { id: 3, nombre: "Marco Torres", email: "mtorres@yahoo.com", telefono: "+504 8765-4321", rol: "cliente", fechaRegistro: "2026-03-20", totalReservas: 5 },
  { id: 4, nombre: "Laura Suárez", email: "lsuarez@gmail.com", telefono: "+504 9234-5678", rol: "cliente", fechaRegistro: "2026-01-30", totalReservas: 18 },
  { id: 5, nombre: "Admin Sistema", email: "admin@correoadmin.hn", telefono: "+504 2221-3344", rol: "admin", fechaRegistro: "2025-12-01", totalReservas: 0 },
];