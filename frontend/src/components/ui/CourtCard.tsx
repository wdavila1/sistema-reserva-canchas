import { Badge } from "../ui/Badge"
import type { Court } from "../../types/sports/Court";
import { sportColor } from "../../utils/sportColor";
import { sportEmoji } from "../../utils/sportEmoji";
import { formatCurrency } from "../../utils/formatCurrency";

export function CourtCard({
  court, onClick,
}: {
  court: Court;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={court.imagen}
          alt={court.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={sportColor[court.deporte]}>
            {sportEmoji[court.deporte]} {court.deporte}
          </Badge>
        </div>
        {!court.disponible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-foreground font-semibold text-sm px-4 py-1.5 rounded-full">
              No disponible
            </span>
          </div>
        )}
        {court.techada && (
          <div className="absolute bottom-3 right-3">
            <span className="text-xs bg-white/90 text-foreground font-medium px-2.5 py-1 rounded-full">
              🏠 Techada
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground leading-tight mb-1">{court.nombre}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{court.descripcion}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {formatCurrency(court.precio)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">/ hora</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${court.disponible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {court.disponible ? "● Disponible" : "● No disponible"}
          </span>
        </div>
      </div>
    </div>
  );
}

