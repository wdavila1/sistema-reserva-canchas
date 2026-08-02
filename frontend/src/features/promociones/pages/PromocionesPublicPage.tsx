import { useState, useEffect } from "react";
import { getPromocionesActivas } from "@/features/promociones/services/promociones.api";
import type { Promocion } from "@/features/promociones/services/promociones.api";
import { Tag, Clock, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function PromocionesPublicPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromocionesActivas()
      .then(setPromociones)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b-4 border-primary pb-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
          <h1 className="font-headline-xl text-5xl md:text-7xl uppercase italic text-primary leading-none tracking-tighter">
            Promociones
          </h1>
          <p className="text-muted-foreground mt-4 text-lg md:text-xl max-w-2xl font-medium">
            ¡Aprovecha estos descuentos especiales y reserva tu cancha al mejor precio!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-muted-foreground font-headline-md text-xl uppercase animate-pulse">Cargando promociones...</span>
          </div>
        ) : promociones.length === 0 ? (
          <div className="bg-card border-4 border-border p-16 text-center shadow-[12px_12px_0px_0px_#0b1f3a]">
            <Tag size={64} className="mx-auto text-muted-foreground/30 mb-6" strokeWidth={1} />
            <h2 className="font-headline-xl text-3xl uppercase text-foreground mb-3">Sin promociones por ahora</h2>
            <p className="text-muted-foreground text-lg">Revisa más tarde para descubrir nuevos descuentos exclusivos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promociones.map((p) => (
              <div key={p.promocionid} className="group bg-card border-4 border-primary p-6 shadow-[8px_8px_0px_0px_#0b1f3a] hover:shadow-[2px_2px_0px_0px_#0b1f3a] hover:translate-x-1.5 hover:translate-y-1.5 transition-all flex flex-col h-full relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full transition-transform group-hover:scale-150" />
                
                <div className="mb-6 flex items-start justify-between gap-4 relative z-10">
                  <div>
                    <h3 className="font-headline-md text-2xl uppercase leading-none text-foreground">{p.titulo}</h3>
                    {p.descripcion && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{p.descripcion}</p>
                    )}
                  </div>
                  <div className="bg-secondary text-primary-foreground border-2 border-primary shadow-[3px_3px_0px_0px_#0b1f3a] font-data-display text-2xl px-3 py-1 -rotate-3 group-hover:rotate-0 transition-transform flex-shrink-0">
                    {p.porcentajedescuento}%
                  </div>
                </div>

                <div className="mt-auto space-y-3 pt-6 border-t-2 border-dashed border-border relative z-10">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span className="font-semibold uppercase tracking-wider">
                      {p.diasemana !== null && p.diasemana !== undefined ? `Todos los ${DIAS[p.diasemana]}` : "Cualquier día"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock size={18} className="text-primary" />
                    <span className="font-semibold uppercase tracking-wider font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                      {p.horainicio && p.horafin ? `${p.horainicio.slice(0,5)} a ${p.horafin.slice(0,5)}` : "Cualquier hora"}
                    </span>
                  </div>
                </div>

                <Link to="/canchas" className="mt-8 w-full bg-background text-foreground font-headline-md text-lg uppercase py-3 border-4 border-primary flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer relative z-10">
                  Reservar cancha <ChevronRight size={20} strokeWidth={3} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PromocionesPublicPage;
