import { Badge } from "../ui/Badge"
import type { Cancha } from "@/features/canchas/services/canchas.api";
import { formatCurrency } from "../../utils/formatCurrency";
import { sportColor } from "../../utils/sportColor";
import {Users} from "lucide-react";

export function CourtCard({
  court, onClick,
}: {
  court: Cancha;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-card border-2 border-primary overflow-hidden group hover:shadow-[4px_4px_0px_0px_#0b1f3a] transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 bg-muted overflow-hidden shrink-0">
        <img
          src={court.ImagenURL || "https://images.unsplash.com/photo-1667021836621-ef302544b61f?q=80&w=1039&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          alt={court.NombreCancha}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {court.Estado !== 'Disponible' && (
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center backdrop-blur-[2px]">
            <Badge variant="danger" className="uppercase tracking-wide font-bold px-3 py-1 text-xs">
              {court.Estado === 'Mantenimiento' ? '🔧 En Mantenimiento' : 'Ocupada'}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">

         <div className="mb-5 flex flex-col items-start gap-3">
           <h3 className="text-xl font-bold text-foreground truncate w-full" title={court.NombreCancha}>
             {court.NombreCancha}
           </h3>
           <div className="flex flex-wrap items-center gap-2">

             <Badge className={`${sportColor[court.NombreTipo || "Deporte"]} text-[10px] uppercase`}>
               {court.NombreTipo || "Deporte"}
             </Badge>
             
              <Badge variant="default" className="gap-2 px-3 py-1 text-[10px]">
                <Users size={12} className="text-secondary" strokeWidth={3} />
                <span className="mt-px">{court.Capacidad} PERS.</span>
              </Badge>

           </div>
         </div>

        <div className="flex justify-between items-center border-t-2 border-muted pt-4 mt-auto">
          <span className="font-data-display text-[20px] text-primary font-bold">
            {formatCurrency(Number(court.PrecioPorHora))}
          </span>
          {court.Estado === 'Disponible' ? (
            <Badge variant="success">DISPONIBLE</Badge>
          ) : court.Estado === 'Mantenimiento' ? (
            <Badge variant="danger" className="bg-amber-100 text-amber-800 border-amber-300 font-bold uppercase text-[10px]">MANTENIMIENTO</Badge>
          ) : (
            <Badge variant="danger">OCUPADA</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
