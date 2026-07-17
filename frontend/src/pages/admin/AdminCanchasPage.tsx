import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

//MOCKS
import { CANCHAS } from "../../mocks/courts"

//UTILS
import { formatCurrency } from "../../utils/formatCurrency";
import { sportColor } from "../../utils/sportColor";
import { sportEmoji } from "../../utils/sportEmoji";


//COMPONENTS
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button"

function AdminCanchas() {
  const [courts, setCourts] = useState(CANCHAS);

  const toggle = (id: number) =>
    setCourts((cs) => cs.map((c) => c.id === id ? { ...c, disponible: !c.disponible } : c));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Gestión de Canchas
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{courts.length} canchas registradas</p>
        </div>
        <Button variant="primary">
          <Plus size={16} /> Nueva cancha
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Cancha", "Deporte", "Precio L-V", "Precio S-D", "Superficie", "Techada", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courts.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={c.imagen} alt={c.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <span className="font-medium text-foreground whitespace-nowrap">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={sportColor[c.deporte]}> {c.deporte}</Badge>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm">{formatCurrency(c.precio)}</td>
                  <td className="px-5 py-4 font-mono text-sm">{formatCurrency(c.precioFinde)}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs whitespace-nowrap">{c.superficie}</td>
                  <td className="px-5 py-4 text-center">{c.techada ? "✓" : "—"}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggle(c.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        c.disponible ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {c.disponible ? "Disponible" : "Inactiva"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCanchas;