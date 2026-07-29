import { useState, useEffect } from "react";
import {
  getKpis,
  getReservasPorPeriodo,
  getCanchasMasUsadas,
} from "../services/reportes.api";
import type { Kpis, ReservasPorPeriodoItem, CanchaMasUsadaItem, Rango } from "../types/Reporte";

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function calcularRango(): Rango {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
  return {
    fechaInicio: toISODate(inicio),
    fechaFin: toISODate(hoy),
  };
}

export function useReportes() {
  const [kpis, setKpis] = useState<Kpis>({
    totalReservas: 0,
    ingresosBrutos: 0,
    isv: 0,
    ingresosNetos: 0,
  });
  const [porPeriodo, setPorPeriodo] = useState<ReservasPorPeriodoItem[]>([]);
  const [canchas, setCanchas] = useState<CanchaMasUsadaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rango = calcularRango();

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [kpisData, periodoData, canchasData] = await Promise.all([
          getKpis(),
          getReservasPorPeriodo(),
          getCanchasMasUsadas(),
        ]);
        setKpis(kpisData);
        setPorPeriodo(periodoData);
        setCanchas(canchasData);
      } catch (err) {
        setError("Error al cargar los reportes. Verificá tu conexión e intentá de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { kpis, porPeriodo, canchas, rango, isLoading, error };
}