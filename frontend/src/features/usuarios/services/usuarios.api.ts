import { axiosClient } from "@/shared/services/axiosClient";
import type { Paginacion } from "@/shared/types/Paginacion";

export interface Usuario {
  UsuarioID: number;
  PersonaID: number;
  RolID: number;
  NombreRol: string;
  NombreUsuario: string;
  EstadoUsuario: boolean;
  FechaCreacion: string;
  FechaModificacion: string | null;
  PrimerNombre: string;
  SegundoNombre: string | null;
  PrimerApellido: string;
  SegundoApellido: string | null;
  NumeroIdentidad: string | null;
  RTN: string | null;
  Correo: string;
  Telefono: string;
  Direccion: string | null;
  FotoPerfilURL: string | null;
  TotalReservas?: number;
}

export interface Rol {
  RolID: number;
  NombreRol: string;
  Descripcion: string | null;
}

export interface UsuarioPayload {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  numeroIdentidad?: string;
  rtn?: string;
  correo: string;
  telefono: string;
  direccion?: string;
  nombreUsuario: string;
  rolId: number;
}

export interface UsuariosListResponse {
  data: Usuario[];
  pagination: Paginacion;
}

export interface CrearUsuarioResponse {
  usuario: Usuario;
  passwordTemporal: string;
}

export interface ResetPasswordResponse {
  passwordTemporal: string;
}

// Listado paginado, con filtro opcional por rol y búsqueda (GET)
export const getUsuarios = async (
  filtros: { page?: number; limit?: number; rolId?: number; busqueda?: string } = {}
): Promise<UsuariosListResponse> => {
  const response = await axiosClient.get("/usuarios", { params: filtros });
  return response.data;
};

// Catálogo de roles para el <select> del formulario (GET)
export const getRoles = async (): Promise<Rol[]> => {
  const response = await axiosClient.get("/usuarios/roles");
  return response.data;
};

// Traer uno solo por ID (GET)
export const getUsuarioById = async (id: string | number): Promise<Usuario> => {
  const response = await axiosClient.get(`/usuarios/${id}`);
  return response.data;
};

// Crear (POST) — el backend genera una contraseña temporal y la devuelve una sola vez
export const createUsuario = async (data: UsuarioPayload): Promise<CrearUsuarioResponse> => {
  const response = await axiosClient.post("/usuarios", data);
  return response.data;
};

// Actualizar (PUT)
export const updateUsuario = async (id: string | number, data: UsuarioPayload): Promise<Usuario> => {
  const response = await axiosClient.put(`/usuarios/${id}`, data);
  return response.data;
};

// Activar/desactivar — borrado seguro (PATCH)
export const updateUsuarioEstado = async (id: string | number, estado: boolean): Promise<Usuario> => {
  const response = await axiosClient.patch(`/usuarios/${id}/estado`, { estado });
  return response.data;
};

// Resetear contraseña (PATCH)
export const resetPasswordUsuario = async (id: string | number): Promise<ResetPasswordResponse> => {
  const response = await axiosClient.patch(`/usuarios/${id}/password`);
  return response.data;
};

// Eliminar físicamente — solo si no tiene historial asociado (DELETE)
export const deleteUsuario = async (id: string | number): Promise<{ mensaje: string }> => {
  const response = await axiosClient.delete(`/usuarios/${id}`);
  return response.data;
};