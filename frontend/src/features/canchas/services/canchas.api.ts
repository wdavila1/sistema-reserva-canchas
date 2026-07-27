import { axiosClient } from "@/shared/services/axiosClient";

export interface Cancha {
    CanchaID: number;
    TipoCanchaID: number;
    NombreCancha: string;
    Capacidad: number;
    PrecioPorHora: number;
    Estado: 'Disponible' | 'Ocupada' | 'Mantenimiento';
    Descripcion: string | null;
    ImagenURL: string | null;
    NombreTipo?: string;
}

export interface CanchaPayload {
  tipoCanchaId: number;
  nombreCancha: string;
  capacidad: number;
  precioPorHora: number;
  estado?: string;
  descripcion?: string;
  imagenUrl?: string;
}

export interface DisponibilidadResponse {
  canchaId: number;
  fecha: string;
  horasDisponibles: string[];
}

export interface DisponibilidadSemanaResponse {
  canchaId: number;
  disponibilidad: Record<string, string[]>; 
}

// Traer todas (GET)
export const getCanchas = async (filtros?: Record<string, any>): Promise<Cancha[]> => {
    const response = await axiosClient.get('/canchas', { params: filtros });
    return response.data;
};
// Traer una sola por ID (GET)
export const getCanchaById = async (id: string | number): Promise<Cancha> => {
    const response = await axiosClient.get(`/canchas/${id}`);
    return response.data;
};
// Crear una cancha (POST)
export const createCancha = async (data: CanchaPayload): Promise<Cancha> => {
    const response = await axiosClient.post('/canchas', data);
    return response.data;
};
// Actualizar todos los datos (PUT)
export const updateCancha = async (id: string | number, data: CanchaPayload): Promise<Cancha> => {
    const response = await axiosClient.put(`/canchas/${id}`, data);
    return response.data;
};
// Actualizar solo el estado (PATCH)
export const updateCanchaStatus = async (id: string | number, estado: string): Promise<Cancha> => {
    const response = await axiosClient.patch(`/canchas/${id}/estado`, { estado });
    return response.data;
};
// Eliminar (DELETE)
export const deleteCancha = async (id: string | number): Promise<{mensaje: string}> => {
    const response = await axiosClient.delete(`/canchas/${id}`);
    return response.data;
};

// Disponibilidad (GET)
export const getDisponibilidad = async (id: string | number, fecha: string): Promise<DisponibilidadResponse> => {
    const response = await axiosClient.get(`/canchas/${id}/disponibilidad`, {
        params: { fecha }
    });
    return response.data;
};

// Disponibilidad semanal (GET)
export const getDisponibilidadSemana = async (
    id: string | number, 
    fechaInicio: string, 
    fechaFin: string
): Promise<DisponibilidadSemanaResponse> => {
    const response = await axiosClient.get(`/canchas/${id}/disponibilidad/semanal`, {
        params: { fechaInicio, fechaFin }
    });
  return response.data;
};