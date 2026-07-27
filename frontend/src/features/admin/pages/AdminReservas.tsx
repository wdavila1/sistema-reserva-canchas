import { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";

//API
import { getTodasLasReservas, actualizarEstadoReserva, cancelarReserva } from "@/features/reservas/services/reservas.api";
import type { Reserva, EstadoReserva } from "@/features/reservas/services/reservas.api";

//UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { estadoStyle } from "@/shared/utils/estadoStyle";
import { estadoLabel } from "@/shared/utils/estadoLabel";
import type { ReservationStatus } from "@/features/reservas/types/ReservationStatus";

//COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

/** El backend devuelve EstadoReserva con mayúscula inicial ("Pendiente",
 * "Confirmada", ...), pero estadoStyle/estadoLabel están indexados en
 * minúsculas -- se normaliza aquí antes de usarlos. */
function normalizarEstado(estado: string): ReservationStatus {
  return estado.toLowerCase() as ReservationStatus;
}

const ESTADOS_FILTRO = ["Todos", "Pendiente", "Confirmada", "Completada", "Cancelada"];

// Próximo estado que el admin puede asignar manualmente (no incluye
// "Cancelada" -- esa siempre pasa por cancelarReserva, no por este endpoint).
const SIGUIENTE_ESTADO: Partial<Record<EstadoReserva, Exclude<EstadoReserva, "Cancelada">>> = {
  Pendiente: "Confirmada",
  Confirmada: "Completada",
};

function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);

  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [search, setSearch] = useState("");

  const cargarReservas = () => {
    setIsLoading(true);
    getTodasLasReservas()
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar las reservas."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleAvanzarEstado = async (r: Reserva) => {
    const siguiente = SIGUIENTE_ESTADO[r.estadoReserva];
    if (!siguiente) return;
    setActualizandoId(r.reservaId);
    try {
      await actualizarEstadoReserva(r.reservaId, siguiente);
      cargarReservas();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "No se pudo actualizar el estado.");
    } finally {
      setActualizandoId(null);
    }
  };

  const handleCancelar = async (reservaId: number) => {
    setActualizandoId(reservaId);
    try {
      await cancelarReserva(reservaId);
      cargarReservas();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "No se pudo cancelar la reserva.");
    } finally {
      setActualizandoId(null);
    }
  };

  const filtered = reservas.filter((r) => {
    if (filterEstado !== "Todos" && r.estadoReserva !== filterEstado) return false;
    if (search) {
      const nombreCliente = `${r.cliente?.primerNombre ?? ""} ${r.cliente?.primerApellido ?? ""}`.toLowerCase();
      const coincideId = String(r.reservaId).includes(search);
      const coincideNombre = nombreCliente.includes(search.toLowerCase());
      if (!coincideId && !coincideNombre) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Reservas
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{reservas.length} reservas en total</p>
        </div>
        <Button variant="outline">
          <Download size={15} /> Exportar
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar por cliente o ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS_FILTRO.map((s) => (
            <button
              key={s}
              onClick={() => setFilterEstado(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterEstado === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["ID", "Cliente", "Cancha", "Fecha", "Horario", "Total", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const estado = normalizarEstado(r.estadoReserva);
                const siguiente = SIGUIENTE_ESTADO[r.estadoReserva];
                const puedeCancelar = r.estadoReserva === "Pendiente" || r.estadoReserva === "Confirmada";
                const primerBloque = r.bloques[0];
                return (
                  <tr key={r.reservaId} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">#{r.reservaId}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-foreground">
                        {r.cliente ? `${r.cliente.primerNombre} ${r.cliente.primerApellido}` : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">{r.cliente?.correo}</div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap text-xs">
                      {r.bloques.map((b) => b.nombreCancha).join(", ")}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {primerBloque?.fecha}
                      {r.bloques.length > 1 && <span className="text-xs"> (+{r.bloques.length - 1} más)</span>}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {primerBloque && `${primerBloque.horaInicio} – ${primerBloque.horaFin}`}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-primary whitespace-nowrap">{formatCurrency(r.total)}</td>
                    <td className="px-5 py-3.5">
                      <Badge className={`${estadoStyle[estado]} border-transparent`}>{estadoLabel[estado]}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {siguiente && (
                          <button
                            onClick={() => handleAvanzarEstado(r)}
                            disabled={actualizandoId === r.reservaId}
                            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                          >
                            Marcar {siguiente.toLowerCase()}
                          </button>
                        )}
                        {puedeCancelar && (
                          <button
                            onClick={() => handleCancelar(r.reservaId)}
                            disabled={actualizandoId === r.reservaId}
                            className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground text-sm">Cargando reservas...</div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No se encontraron reservas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReservas;
