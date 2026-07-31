import { axiosClient } from "@/shared/services/axiosClient";

// Tipo del perfil extendido (superset de UserAccount, con todos los campos de Personas/Usuarios)
export interface Perfil {
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
  TotalReservas: number;
}

export interface UpdatePerfilPayload {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  numeroIdentidad?: string;
  rtn?: string;
  correo: string;
  telefono: string;
  direccion?: string;
}

export interface ChangePasswordPayload {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}

// GET /api/perfil
export const getMiPerfil = async (): Promise<Perfil> => {
  const { data } = await axiosClient.get<Perfil>("/perfil");
  return data;
};

// PUT /api/perfil
export const updateMiPerfil = async (payload: UpdatePerfilPayload): Promise<Perfil> => {
  const { data } = await axiosClient.put<Perfil>("/perfil", payload);
  return data;
};

// PATCH /api/perfil/password
export const changePassword = async (payload: ChangePasswordPayload): Promise<{ mensaje: string }> => {
  const { data } = await axiosClient.patch<{ mensaje: string }>("/perfil/password", payload);
  return data;
};

// PATCH /api/perfil/foto  (multipart/form-data)
export const uploadFotoPerfil = async (file: File): Promise<{ fotoPerfilURL: string }> => {
  const form = new FormData();
  form.append("foto", file);
  const { data } = await axiosClient.patch<{ fotoPerfilURL: string }>("/perfil/foto", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// DELETE /api/perfil/foto
export const deleteFotoPerfil = async (): Promise<{ mensaje: string }> => {
  const { data } = await axiosClient.delete<{ mensaje: string }>("/perfil/foto");
  return data;
};
