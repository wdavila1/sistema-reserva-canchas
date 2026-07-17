import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { SportFilter } from "../types/sports/SportFilter";
import { CANCHAS } from "../mocks/courts";
import { HORARIOS } from "@/mocks/horarios";

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
  const [date, setDate] = useState(() =>
  {
    const td = new Date();
    const yyyy = td.getFullYear();
    const mm = String(td.getMonth() + 1).padStart(2, "0");
    const dd = String(td.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }
  );
  const availableSearchHours = HORARIOS.filter(h => h !== "22:00");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");

  const deporteParam = searchParams.get("deporte");
  const currentSports: SportFilter[] = deporteParam ? deporteParam.split(",").map(d => paramToSport[d.toLowerCase()]).filter(Boolean) as SportFilter[]: ["Todos"];

  const handleSportChange = (s: SportFilter) => {
    if (s === "Todos") {
      searchParams.delete("deporte");
      setSearchParams(searchParams);
    } else {
      const urlVal = Object.keys(paramToSport).find(key => paramToSport[key] === s) || s.toLowerCase();
      setSearchParams({ deporte: urlVal });
    }
  };

  const filteredCanchas = CANCHAS.filter((c) => {
    if (!currentSports.includes("Todos") && !currentSports.includes(c.deporte)) return false;
    if (search && !c.nombre.toLowerCase().includes(search.toLowerCase())) return false;
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
    };
}