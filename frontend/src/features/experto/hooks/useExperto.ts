import { useEffect, useState } from "react";
import { getResumenExperto, getPatronesAltaDemanda, getSugerenciasPromociones, getSugerenciaUsuario } from "../services/experto.api";
import type { ResumenExperto, PatronDemanda, SugerenciaPromocion, SugerenciaUsuario } from "../services/experto.api";

/** Hook que carga el resumen rápido de métricas del sistema experto (para StatCards del dashboard) */
export function useResumenExperto() {
  const [resumen, setResumen] = useState<ResumenExperto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getResumenExperto()
      .then(setResumen)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return { resumen, loading, error };
}

/** Hook que carga los patrones de alta demanda (horarios pico) */
export function usePatronesAltaDemanda() {
  const [patrones, setPatrones] = useState<PatronDemanda[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getPatronesAltaDemanda()
      .then((r) => {
        setPatrones(r.patrones);
        setTotal(r.totalHorariosPico);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return { patrones, total, loading, error };
}

/** Hook que carga las sugerencias de promoción por baja ocupación */
export function useSugerenciasPromociones() {
  const [sugerencias, setSugerencias] = useState<SugerenciaPromocion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cargar = () => {
    setLoading(true);
    getSugerenciasPromociones()
      .then((r) => {
        setSugerencias(r.sugerencias);
        setTotal(r.totalSugerencias);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  return { sugerencias, total, loading, error, refetch: cargar };
}

/** Hook que carga la sugerencia personalizada para el usuario cliente */
export function useSugerenciaUsuario(isAuthenticated: boolean) {
  const [sugerenciaData, setSugerenciaData] = useState<SugerenciaUsuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    getSugerenciaUsuario()
      .then(setSugerenciaData)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return { sugerenciaData, loading, error };
}

