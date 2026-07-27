import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { SportFilter } from "../types/SportFilter";
import { HORARIOS } from "@/constants/horarios";

import { getCanchas } from "../services/canchas.api";
import type { Cancha } from "../services/canchas.api";

export const SPORTS_LIST: SportFilter[] = ["Todos", "Fútbol 5", "Baloncesto", "Voleibol", "Tenis", "Pádel"];

const paramToSport: Record<string, SportFilter> = {
  "futbol": "Fútbol 5",
  "baloncesto": "Baloncesto",
  "voleibol": "Voleibol",
  "tenis": "Tenis",
  "padel": "Pádel",
};

// ESTE HOOK SE ENCARGA DE TODA LA LÓGICA
export function useCanchas() {
  const [searchParams, setSearchParams] = useSearchParams();
  

  const [canchasBD, setCanchasBD] = useState<Cancha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(() => {
    const td = new Date();
    const yyyy = td.getFullYear();
    const mm = String(td.getMonth() + 1).padStart(2, "0");
    const dd = String(td.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  });

  const availableSearchHours = HORARIOS.filter(h => h !== "22:00");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");

  const deporteParam = searchParams.get("deporte");
  const currentSports: SportFilter[] = deporteParam 
    ? deporteParam.split(",").map(d => paramToSport[d.toLowerCase()]).filter(Boolean) as SportFilter[]
    : ["Todos"];


  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        setIsLoading(true);
        const data = await getCanchas();
        setCanchasBD(data);
      } catch (err) {
        setError("Error al cargar las canchas de la base de datos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCanchas();
  }, []);

  const handleSportChange = (s: SportFilter) => {
    if (s === "Todos") {
      searchParams.delete("deporte");
      setSearchParams(searchParams);
    } else {
      const urlVal = Object.keys(paramToSport).find(key => paramToSport[key] === s) || s.toLowerCase();
      setSearchParams({ deporte: urlVal });
    }
  };

  const filteredCanchas = canchasBD.filter((c) => {
    if (!currentSports.includes("Todos") && !currentSports.includes(c.NombreTipo as SportFilter)) return false;
    if (search && !c.NombreCancha.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Retorna solo lo que la vista necesita
  return {
    search, setSearch,
    date, setDate,
    time, setTime,
    currentSports,
    handleSportChange,
    filteredCanchas,
    availableSearchHours,
    isLoading, 
    error
  };
}