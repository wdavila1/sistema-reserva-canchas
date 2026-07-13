import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SportFilter } from "../types/sports/SportFilter";
import { CANCHAS } from "../mocks/courts";
import { CourtCard } from "../components/ui/CourtCard";
import { Search, Trophy, Filter } from "lucide-react";
import { sportEmoji } from "../utils/sportEmoji";
import { HORARIOS } from "../mocks/horarios";

function CanchasPage() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<SportFilter>("Todos");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");

  const sports: SportFilter[] = ["Todos", "Fútbol 5", "Baloncesto", "Voleibol", "Tenis", "Pádel"];

  const filtered = CANCHAS.filter((c) => {
    if (sport !== "Todos" && c.deporte !== sport) return false;
    if (search && !c.nombre.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-black text-foreground mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Nuestras Canchas
          </h1>
          <p className="text-muted-foreground">{filtered.length} canchas disponibles en Tegucigalpa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-8 flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar cancha..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-muted-foreground" />
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  sport === s
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {s !== "Todos" && sportEmoji[s]} {s}
              </button>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            <input
              type="date"
              className="px-3 py-2.5 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="px-3 py-2.5 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Cualquier hora</option>
              {HORARIOS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No se encontraron canchas</p>
            <p className="text-sm mt-1">Intenta con otro filtro o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CourtCard
                key={c.id}
                court={c}
                onClick={() => navigate(`/canchas/${c.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CanchasPage;
