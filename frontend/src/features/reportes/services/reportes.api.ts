import { axiosClient } from "@/shared/services/axiosClient";
import type { Kpis, ReservasPorPeriodoItem, CanchaMasUsadaItem } from "../types/Reporte";

export const getKpis = async (): Promise<Kpis> => {
  const { data } = await axiosClient.get<Kpis>("/reportes/kpis");
  return data;
};

export const getReservasPorPeriodo = async (): Promise<ReservasPorPeriodoItem[]> => {
  const { data } = await axiosClient.get<ReservasPorPeriodoItem[]>("/reportes/reservas-por-periodo");
  return data;
};

export const getCanchasMasUsadas = async (): Promise<CanchaMasUsadaItem[]> => {
  const { data } = await axiosClient.get<CanchaMasUsadaItem[]>("/reportes/canchas-mas-usadas");
  return data;
};