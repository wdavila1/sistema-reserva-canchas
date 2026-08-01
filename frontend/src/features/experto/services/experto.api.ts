import { axiosClient } from "@/shared/services/axiosClient";

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface SugerenciaUsuario {
  tieneSugerencia: boolean;
  mensaje?: string;
  sugerencia?: {
    diaSemana: number;
    nombreDia: string;
    horaInicio: string;
    nombreCancha: string;
    tipoCancha: string;
    totalReservas: number;
    mensaje: string;
  };
}

export interface PatronDemanda {
  diaSemana: number;
  nombreDia: string;
  horaInicio: string;
  totalReservas: number;
  totalCanchas: number;
  porcentajeOcupacion: number;
  nivel: "alto" | "critico";
}

export interface SugerenciaPromocion {
  diaSemana: number;
  nombreDia: string;
  horaInicio: string;
  totalReservas: number;
  porcentajeOcupacion: number;
  descuentoSugerido: number;
  yaTienePromocion: boolean;
  promocionSugerida: {
    titulo: string;
    porcentajeDescuento: number;
    diaSemana: number;
    horaInicio: string;
  };
  mensaje: string;
}

export interface ResumenExperto {
  horarios_pico: number;
  sugerencias_pendientes: number;
  cancha_mas_popular: { cancha_top: string; reservas_mes: number } | null;
}

// ── Servicios ────────────────────────────────────────────────────────────────

/** GET /api/experto/sugerencia-usuario — para el usuario autenticado */
export async function getSugerenciaUsuario(): Promise<SugerenciaUsuario> {
  const { data } = await axiosClient.get<SugerenciaUsuario>("/experto/sugerencia-usuario");
  return data;
}

/** GET /api/experto/resumen — métricas rápidas para el dashboard del admin */
export async function getResumenExperto(): Promise<ResumenExperto> {
  const { data } = await axiosClient.get<ResumenExperto>("/experto/resumen");
  return data;
}

/** GET /api/experto/patrones-demanda — horarios pico para el admin */
export async function getPatronesAltaDemanda(): Promise<{
  totalHorariosPico: number;
  patrones: PatronDemanda[];
}> {
  const { data } = await axiosClient.get("/experto/patrones-demanda");
  return data;
}

/** GET /api/experto/sugerencias-promociones — baja ocupación para el admin */
export async function getSugerenciasPromociones(): Promise<{
  totalSugerencias: number;
  sugerencias: SugerenciaPromocion[];
}> {
  const { data } = await axiosClient.get("/experto/sugerencias-promociones");
  return data;
}
