import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, ArrowRight, X } from "lucide-react";

//API
import { getMisReservas, cancelarReserva } from "../services/reservas.api";
import type { Reserva } from "../services/reservas.api";

//UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { estadoStyle } from "@/shared/utils/estadoStyle";
import { estadoLabel } from "@/shared/utils/estadoLabel";
import type { ReservationStatus } from "../types/ReservationStatus";

//COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

/** El backend devuelve EstadoReserva con mayúscula inicial ("Pendiente", minúsculas -- se normaliza aquí antes de usarlos. */
function normalizarEstado(estado: string): ReservationStatus {
  return estado.toLowerCase() as ReservationStatus;
}

const ESTADOS_CANCELABLES = ["Pendiente", "Confirmada"];

function MisReservasPage() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  const cargarReservas = () => {
    setIsLoading(true);
    getMisReservas()
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar tus reservas."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (reservaId: number) => {
    setCancelandoId(reservaId);
    try {
      await cancelarReserva(reservaId);
      cargarReservas();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "No se pudo cancelar la reserva.");
    } finally {
      setCancelandoId(null);
    }
  };

  // Estadísticas reales, calculadas a partir de lo que devolvió el backend.
  const totalReservas = reservas.length;
  const horasJugadas = reservas.reduce(
    (acc, r) =>
      acc +
      r.bloques.reduce((accBloque, b) => {
        const [hIni] = b.horaInicio.split(":").map(Number);
        const [hFin] = b.horaFin.split(":").map(Number);
        return accBloque + Math.max(0, hFin - hIni);
      }, 0),
    0
  );
  const canchasFavoritas = new Set(
    reservas.flatMap((r) => r.bloques.map((b) => b.canchaId))
  ).size;

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
            ["Total reservas", String(totalReservas), "bg-secondary text-primary"],
            ["Horas jugadas", String(horasJugadas), "bg-orange-100 text-orange-700"],
            ["Canchas distintas", String(canchasFavoritas), "bg-violet-100 text-violet-700"],
          ].map(([label, val, cls]) => (
            <div key={label as string} className={`rounded-2xl p-4 text-center ${cls}`}>
              <p className="text-2xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{val}</p>
              <p className="text-xs mt-0.5 font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 text-sm text-destructive bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {isLoading && (
          <p className="text-center text-muted-foreground py-10">Cargando tus reservas...</p>
        )}

        {!isLoading && reservas.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Todavía no tienes reservas.
          </div>
        )}

        {/* Reservations */}
        <div className="space-y-4">
          {reservas.map((r) => {
            const estado = normalizarEstado(r.estadoReserva);
            const puedeCancelar = ESTADOS_CANCELABLES.includes(r.estadoReserva);
            return (
              <div key={r.reservaId} className="bg-white rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-foreground">
                      {[...new Set(r.bloques.map((b) => b.nombreCancha))].join(", ")}
                    </span>
                    <Badge className={`${estadoStyle[estado]} border-transparent`}>{estadoLabel[estado]}</Badge>
                  </div>
                  {r.bloques.map((b) => (
                    <div key={b.detalleReservaId} className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><CalendarDays size={13} /> {b.fecha.split('T')[0]}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {b.horaInicio.slice(0, 5)} – {b.horaFin.slice(0, 5)}</span>
                    </div>
                  ))}
                  <span className="font-mono text-xs text-muted-foreground">#{r.reservaId}</span>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                  <p className="font-bold text-lg text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {formatCurrency(r.total)}
                  </p>
                  {puedeCancelar && (
                    <button
                      onClick={() => handleCancelar(r.reservaId)}
                      disabled={cancelandoId === r.reservaId}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50"
                    >
                      <X size={12} /> {cancelandoId === r.reservaId ? "Cancelando..." : "Cancelar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/canchas")}>
            Hacer una nueva reserva <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MisReservasPage;
