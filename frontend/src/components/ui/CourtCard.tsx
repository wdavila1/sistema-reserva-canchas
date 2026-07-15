import { Badge } from "../ui/Badge"
import type { Court } from "../../types/sports/Court";
import { sportColor } from "../../utils/sportColor";
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
      className="bg-card border-2 border-primary overflow-hidden group hover:shadow-[4px_4px_0px_0px_#0b1f3a] transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={court.imagen}
          alt={court.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!court.disponible && (
          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[2px]">
            <Badge variant="danger">Ocupada</Badge>
          </div>
        )}
      </div>
      <div className="p-stack-md">
         <div className="flex justify-between items-center border-t-2 border-muted pt-stack-sm mt-2">
          <span className="font-data-display text-[20px] text-primary"> {formatCurrency(court.precio)}</span>
          {court.disponible ? (
            <Badge variant="success">Disponible</Badge>
          ) : (
            <Badge variant="danger">No disponible</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

