import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/ui/StatCard";
import { CalendarDays, CreditCard, Users, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, } from "recharts";

//MOCKS
import { RESERVACIONES } from "@/mocks/reservaciones";
import { DATA_MENSUAL } from "@/mocks/dataMensual";

//COMPONENTS
import { Badge } from "@/components/ui/Badge";

//UTILS
import { estadoStyle } from "@/utils/estadoStyle";
import { estadoLabel } from "@/utils/estadoLabel";
import { formatCurrency } from "@/utils/formatCurrency";

function AdminDashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Panel de Control
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Lunes, 22 de junio de 2026</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Reservas hoy" value="8" sub="↑ 2 vs. ayer" icon={<CalendarDays size={18} />} accent />
        <StatCard title="Ingresos del mes" value="L. 94,800" sub="ISV incluido" icon={<CreditCard size={18} />} />
        <StatCard title="Canchas activas" value="5/6" sub="1 en mantenimiento" icon={<Layers size={18} />} />
        <StatCard title="Usuarios" value="42" sub="4 nuevos esta semana" icon={<Users size={18} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-5">Reservas por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DATA_MENSUAL} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }}
                formatter={(v) => [`${v} reservas`, "Reservas"]}
              />
              <Bar dataKey="reservas" fill="#0d7a3e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-5">Ingresos mensuales (L.)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={DATA_MENSUAL}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }}
                formatter={(v) => [`L. ${(v as number).toLocaleString("es-HN")}`, "Ingresos"]}
              />
              <Line type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent reservations */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-foreground">Reservas recientes</h3>
          <button onClick={() => navigate("/admin/reservas")} className="text-sm text-primary font-medium hover:underline">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["ID", "Cliente", "Cancha", "Fecha", "Estado", "Total"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESERVACIONES.slice(0, 5).map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3.5 font-medium">{r.usuario}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.cancha.split("—")[0].trim()}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.fecha} · {r.horaInicio}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant = "success" className={`${estadoStyle[r.estado]} border-transparent`}>{estadoLabel[r.estado]}</Badge>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;