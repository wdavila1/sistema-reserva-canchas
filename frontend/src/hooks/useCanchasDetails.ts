import { useState, useEffect } from "react";
import { getCanchaById, getDisponibilidadSemana} from "../services/canchas.api";
import type { Cancha } from "../services/canchas.api";

export function useCanchaDetail(canchaId: string | undefined) {
  const [court, setCourt] = useState<Cancha | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, string[]>>({});
  const [daysHeaders, setDaysHeaders] = useState<string[]>([]);
  const [fechasArr, setFechasArr] = useState<string[]>([]);

  useEffect(() => {
    if (!canchaId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Calcular las fechas de los próximos 7 días
        const fechas = [];
        const diasGenerados = [];
        const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        
        for (let i = 0; i < 7; i++) {
          const f = new Date();
          f.setDate(f.getDate() + i);
          
          diasGenerados.push(nombresDias[f.getDay()]);
          fechas.push(`${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`);
        }
        
        setDaysHeaders(diasGenerados);
        setFechasArr(fechas);

        const fechaInicio = fechas[0];
        const fechaFin = fechas[6];

        // Traer la info de la cancha Y toda la disponibilidad de la semana a la vez
        const [dataCancha, dataDisponibilidad] = await Promise.all([
          getCanchaById(canchaId),
          getDisponibilidadSemana(canchaId, fechaInicio, fechaFin)
        ]);

        setCourt(dataCancha);
        setWeeklyAvailability(dataDisponibilidad.disponibilidad); 

      } catch (err) {
        console.error(err);
        setError("Error cargando los detalles de la cancha.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [canchaId]);

  return { court, isLoading, error, daysHeaders, fechasArr: fechasArr, weeklyAvailability };
}