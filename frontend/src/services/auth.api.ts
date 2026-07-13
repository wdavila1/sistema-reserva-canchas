import { axiosClient } from "./axiosClient";
import type { UserAccount } from "../types/user/UserAccount";

/** El backend acepta usuario O correo en el mismo campo "identificador". */
export interface LoginPayload {
  identificador: string;
  contrasena: string;
}

/** Debe calzar con Personas/Usuarios de db.sql — por eso va separado en nombres/apellidos. */
export interface RegistroPayload {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  correo: string;
  telefono: string;
  nombreUsuario: string;
  contrasena: string;
  numeroIdentidad?: string;  // Requerido en el formulario, opcional en la API
  rtn?: string;              // Solo para quienes piden factura con RTN
  direccion?: string;        // Opcional; útil junto al RTN en facturas fiscales
}

interface AuthResponse {
  usuario: UserAccount;
  accessToken: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registro(payload: RegistroPayload): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/registro", payload);
  return data;
}

/** Se llama al cargar la app: usa la cookie httpOnly del refresh token para
 * pedir un access token nuevo, sin que el usuario tenga que loguearse de nuevo. */
export async function refresh(): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/refresh");
  return data;
}

export async function me(): Promise<{ usuario: UserAccount }> {
  const { data } = await axiosClient.get<{ usuario: UserAccount }>("/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  await axiosClient.post("/auth/logout");
}
