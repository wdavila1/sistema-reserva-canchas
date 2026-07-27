export interface UserAccount {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: "admin" | "cliente";
  fechaRegistro: string;
  totalReservas: number;
}