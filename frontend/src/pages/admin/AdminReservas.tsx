import { useState } from "react";
import { Search, Download, Eye, } from "lucide-react";

//MOCKS
import { RESERVACIONES } from "../../mocks/reservaciones";

//UTILS
import { formatCurrency } from "../../utils/formatCurrency";
import { estadoStyle } from "../../utils/estadoStyle";
import { estadoLabel } from "../../utils/estadoLabel";

//COMPONENTS
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button"

function AdminReservas() {
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [search, setSearch] = useState("");

  const filtered = RESERVACIONES.filter((r) => {
    if (filterEstado !== "Todos" && r.estado !== filterEstado.toLowerCase()) return false;
    if (search && !r.usuario.toLowerCase().includes(search.toLowerCase()) && !r.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Reservas
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{RESERVACIONES.length} reservas en total</p>
        </div>
        <Button variant="outline">
          <Download size={15} /> Exportar
        </Button>
      </div>

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
          {["Todos", "Confirmada", "Pendiente", "Completada", "Cancelada"].map((s) => (
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
                {["ID", "Cliente", "Cancha", "Fecha", "Horario", "Total", "Estado", "Pago", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-foreground">{r.usuario}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap text-xs">{r.cancha}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{r.fecha}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{r.horaInicio} – {r.horaFin}</td>
                  <td className="px-5 py-3.5 font-bold text-primary whitespace-nowrap">{formatCurrency(r.total)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="success" className={`${estadoStyle[r.estado]} border-transparent`}>{estadoLabel[r.estado]}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${r.pagado ? "text-emerald-600" : "text-amber-600"}`}>
                      {r.pagado ? `✓ ${r.metodoPago}` : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
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