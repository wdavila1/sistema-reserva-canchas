import { useNavigate } from "react-router-dom";
import { CourtCard } from "../components/ui/CourtCard";
import { Search, Trophy, Filter } from "lucide-react";
import { HORARIOS } from "../mocks/horarios";
import { useCanchas, SPORTS_LIST } from "../hooks/useCanchas"; 

function CanchasPage() {
  const navigate = useNavigate();
  
  // Extraemos toda la lógica desde nuestro hook useCanchas.ts
  const { 
    search, setSearch, 
    date, setDate, 
    time, setTime, 
    currentSports, 
    handleSportChange, 
    filteredCanchas,
    availableSearchHours, 
  } = useCanchas();

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header*/}
      <div className="bg-card border-b-4 border-border pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-headline-xl text-5xl md:text-7xl uppercase italic text-primary mb-2">
            Nuestras Canchas
          </h1>
          <p className="font-body-lg text-muted-foreground uppercase tracking-widest text-sm">
            {filteredCanchas.length} canchas disponibles en Tegucigalpa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Contenedor de Filtros */}
        <div className="bg-card border-4 border-border p-6 mb-8 flex flex-col xl:flex-row gap-6 shadow-[8px_8px_0px_0px_#c3c6cf]">
          
            {/* Input de Búsqueda */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground" />
            </div>
            <input
              placeholder="BUSCAR CANCHA..."
              className="w-full h-full pl-12 pr-4 py-3 border-2 border-border bg-input font-body-md uppercase text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Botones de Deportes */}
          <div className="flex items-center gap-3 flex-wrap flex-[2]">
            <Filter size={18} className="text-primary hidden sm:block" />
            {SPORTS_LIST.map((s) => (
              <button
                key={s}
                onClick={() => handleSportChange(s)}
                className={`px-4 py-2 border-2 text-sm font-headline-md uppercase transition-all whitespace-nowrap cursor-pointer ${
                  currentSports.includes(s)
                    ? "bg-secondary border-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_#1a1c1e] transform -translate-y-1"
                    : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Fecha y Hora */}
          <div className="flex gap-4 flex-wrap">
            <input
              type="date"
              className="px-4 py-3 border-2 border-border bg-input font-body-md uppercase text-sm focus:outline-none focus:border-secondary transition-all cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="px-4 py-3 border-2 border-border bg-input font-body-md uppercase text-sm focus:outline-none focus:border-secondary transition-all cursor-pointer appearance-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">CUALQUIER HORA</option>
              {availableSearchHours.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Canchas */}
        {filteredCanchas.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-border bg-card">
            <Trophy size={64} className="mx-auto mb-6 text-muted-foreground opacity-50" />
            <p className="font-headline-md text-2xl uppercase text-foreground">No se encontraron canchas</p>
            <p className="font-body-md text-muted-foreground mt-2">Intenta con otro filtro o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCanchas.map((c) => (
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