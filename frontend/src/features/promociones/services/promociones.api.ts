import { axiosClient } from "@/shared/services/axiosClient";

export interface Promocion {
  promocionid: number;
  titulo: string;
  descripcion?: string;
  porcentajedescuento: number;
  diasemana: number | null;
  horainicio: string | null;
  horafin: string | null;
  estado: boolean;
  fechacreacion: string;
}

export interface PromocionInput {
  titulo: string;
  descripcion?: string;
  porcentajeDescuento: number;
  diaSemana?: number | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  estado?: boolean;
}

/** GET /api/promociones/activas — pública */
export async function getPromocionesActivas(): Promise<Promocion[]> {
  const { data } = await axiosClient.get<Promocion[]>("/promociones/activas");
  return data;
}

/** GET /api/promociones — solo admin */
export async function getPromociones(): Promise<Promocion[]> {
  const { data } = await axiosClient.get<Promocion[]>("/promociones");
  return data;
}

/** POST /api/promociones — solo admin */
export async function crearPromocion(input: PromocionInput): Promise<Promocion> {
  const { data } = await axiosClient.post<{ mensaje: string; promocion: Promocion }>("/promociones", input);
  return data.promocion;
}

/** PUT /api/promociones/:id — solo admin */
export async function actualizarPromocion(id: number, input: Partial<PromocionInput>): Promise<Promocion> {
  const { data } = await axiosClient.put<{ mensaje: string; promocion: Promocion }>(`/promociones/${id}`, input);
  return data.promocion;
}

/** DELETE /api/promociones/:id — solo admin (desactiva) */
export async function eliminarPromocion(id: number): Promise<void> {
  await axiosClient.delete(`/promociones/${id}`);
}
