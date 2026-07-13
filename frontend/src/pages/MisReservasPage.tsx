import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

//MOCKS
import { CANCHAS } from "../mocks/courts";
import { RESERVACIONES } from "../mocks/reservaciones";

//UTILS
import { formatCurrency } from "../utils/formatCurrency";
import { sportEmoji } from "../utils/sportEmoji";
import { estadoStyle } from "../utils/estadoStyle";
import { estadoLabel } from "../utils/estadoLabel";

//COMPONENTS
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button"

function MisReservasPage() {
  const navigate = useNavigate();
  const myRes = RESERVACIONES.filter((r) =>
    ["RES-2026-001", "RES-2026-004"].includes(r.id)
  );

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="py-8">
          <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Mis Reservas
          </h1>
          <p className="text-muted-foreground mt-1">Historial de tus reservas</p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ["Total reservas", "12", "bg-secondary text-primary"],
            ["Horas jugadas", "18", "bg-orange-100 text-orange-700"],
            ["Canchas favoritas", "2", "bg-violet-100 text-violet-700"],
          ].map(([label, val, cls]) => (
            <div key={label as string} className={`rounded-2xl p-4 text-center ${cls}`}>
              <p className="text-2xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{val}</p>
              <p className="text-xs mt-0.5 font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {/* Reservations */}
        <div className="space-y-4">
          {RESERVACIONES.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                {sportEmoji[CANCHAS.find((c) => c.id === r.canchaId)?.deporte ?? "Fútbol 5"]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-foreground">{r.cancha}</span>
                  <Badge className={`${estadoStyle[r.estado]} border-transparent`}>{estadoLabel[r.estado]}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><CalendarDays size={13} /> {r.fecha}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {r.horaInicio} – {r.horaFin}</span>
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {formatCurrency(r.total)}
                </p>
                <p className="text-xs text-muted-foreground">{r.pagado ? "✓ Pagado" : "Pendiente de pago"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="accent" size="lg" onClick={() => navigate("/canchas")}>
            Hacer una nueva reserva <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MisReservasPage;