import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Users, XCircle, MapPin, Clock, ArrowRight } from "lucide-react";

//MOCKS
import { CANCHAS } from "../mocks/courts";
import { HORARIOS } from "../mocks/horarios";
import { BLOQUEADOS } from "../mocks/bloqueados";

//UTILS
import { formatCurrency } from "../utils/formatCurrency";
import { sportColor } from "../utils/sportColor";


//HOOKS
import { useAuth } from "../hooks/useAuth";

//COMPONENTS
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button"

function CanchaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // TODO: cuando conectemos el backend, reemplazar por services/canchas.api.ts -> getCanchaById(id)
  const court = CANCHAS.find((c) => c.id === Number(id));

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-muted-foreground">
        Cancha no encontrada.
      </div>
    );
  }

  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate("/canchas")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} /> Volver a canchas
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden h-72 sm:h-96 bg-muted">
              <img src={court.imagen} alt={court.nombre} className="w-full h-full object-cover" />
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <Badge className={sportColor[court.deporte]}>
                   {court.deporte}
                </Badge>
                {court.techada && <Badge className="bg-slate-100 text-slate-600 border-slate-200">🏠 Techada</Badge>}
                <Badge className={court.disponible ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}>
                  {court.disponible ? "● Disponible" : "● No disponible"}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {court.nombre}
              </h1>
              <p className="text-muted-foreground mt-3 leading-relaxed">{court.descripcion}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["Superficie", court.superficie],
                ["Capacidad", court.capacidad],
                ["Techada", court.techada ? "Sí" : "No"],
                ["Horario", "7:00 – 22:00"],
              ].map(([k, v]) => (
                <div key={k} className="bg-white border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{k}</p>
                  <p className="font-semibold text-sm text-foreground">{v}</p>
                </div>
              ))}
            </div>

            {/* Amenidades */}
            <div>
              <h3 className="font-bold text-lg mb-3">Amenidades incluidas</h3>
              <div className="flex flex-wrap gap-2">
                {court.amenidades.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 bg-secondary text-primary text-sm px-3 py-1.5 rounded-lg font-medium">
                    <Check size={13} /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly schedule */}
            <div>
              <h3 className="font-bold text-lg mb-4">Disponibilidad semanal</h3>
              <div className="bg-white border border-border rounded-2xl overflow-auto">
                <table className="w-full text-xs min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-3 text-left text-muted-foreground font-medium w-16">Hora</th>
                      {days.map((d) => (
                        <th key={d} className="py-3 px-2 text-center text-muted-foreground font-medium">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIOS.map((h) => (
                      <tr key={h} className="border-b border-border/50 last:border-0">
                        <td className="py-2 px-3 font-mono text-muted-foreground text-xs">{h}</td>
                        {days.map((_, di) => {
                          const blocked = BLOQUEADOS[court.id]?.[di]?.includes(h) ?? false;
                          return (
                            <td key={di} className="py-1.5 px-2 text-center">
                              <span className={`inline-block w-full py-1 rounded text-xs font-medium ${
                                blocked ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-600"
                              }`}>
                                {blocked ? "Ocu." : "Lib."}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block" /> Libre</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" /> Ocupado</span>
              </div>
            </div>
          </div>

          {/* Right: booking card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Precio entre semana</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {formatCurrency(court.precio)}
                  </span>
                  <span className="text-muted-foreground mb-1">/ hora</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Fines de semana: <strong>{formatCurrency(court.precioFinde)}</strong> / hora
                </p>
                <p className="text-xs text-muted-foreground mt-1">Precios incluyen ISV (15%)</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                {[
                  [<MapPin size={14} />, "Col. Lomas del Guijarro, Tegucigalpa"],
                  [<Clock size={14} />, "Disponible 7:00 AM – 10:00 PM"],
                  [<Users size={14} />, `Capacidad: ${court.capacidad}`],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex items-start gap-2.5 text-muted-foreground">
                    <span className="text-primary mt-0.5">{icon as React.ReactNode}</span>
                    <span>{text as string}</span>
                  </div>
                ))}
              </div>

              {court.disponible ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (!isAuthenticated) { navigate("/login"); return; }
                    navigate(`/reservar/${court.id}`);
                  }}
                >
                  Reservar esta cancha <ArrowRight size={16} />
                </Button>
              ) : (
                <div className="text-center p-4 rounded-xl bg-muted border border-border">
                  <XCircle size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-medium">Cancha no disponible</p>
                  <p className="text-xs text-muted-foreground mt-1">Consulta otras opciones</p>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground mt-4">
                Cancela hasta 24 horas antes sin costo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanchaDetailPage;
