import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/shared/components/ui/StatCard";
import { CalendarDays, CreditCard, Users, Layers, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

//API
import { useReportes } from "@/features/reportes/hooks/useReportes";
import { getTodasLasReservas, type ReservaAdminResumen } from "@/features/reservas/services/reservas.api";
import type { ReservationStatus } from "@/features/reservas/types/ReservationStatus";
import { getCanchas, type Cancha } from "@/features/canchas/services/canchas.api";
import { getUsuarios } from "@/features/usuarios/services/usuarios.api";

//COMPONENTS
import { Badge } from "@/shared/components/ui/Badge";

//UTILS
import { estadoStyle } from "@/shared/utils/estadoStyle";
import { estadoLabel } from "@/shared/utils/estadoLabel";
import { formatCurrency } from "@/shared/utils/formatCurrency";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
function formatPeriodo(p: string) {
  const [y, m] = p.split("-");
  return `${MESES[Number(m) - 1]} ${y}`;
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { kpis, porPeriodo, isLoading } = useReportes();

  const [reservasRecientes, setReservasRecientes] = useState<ReservaAdminResumen[]>([]);
  const [loadingRecientes, setLoadingRecientes] = useState(true);

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [todasCanchas, usuarios] = await Promise.all([
          getCanchas(),
          getUsuarios({ page: 1, limit: 1 }),
        ]);
        setCanchas(todasCanchas);
        setUsuariosCount(usuarios.pagination.totalItems);
      } catch (err) {
      } finally {
        setLoadingExtras(false);
      }
    };
    fetchExtras();
  }, []);

  const canchasActivas = canchas.filter((c) => c.Estado === "Disponible").length;
  const totalCanchas = canchas.length;

  useEffect(() => {
    const fetch = async () => {
      try {
        const respuesta = await getTodasLasReservas(1, 5);
        setReservasRecientes(respuesta.data);
      } catch (err) {
        setReservasRecientes([]);
      } finally {
        setLoadingRecientes(false);
      }
    };
    fetch();
  }, []);

  const dataMensual = porPeriodo.map((p) => ({
    mes: formatPeriodo(p.periodo),
    reservas: p.reservas,
    ingresos: p.ingresos,
  }));

  const fechaHoy = new Date().toLocaleDateString("es-HN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Panel de Control
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5 capitalize">{fechaHoy}</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Reservas del período"
          value={isLoading ? "..." : String(kpis.totalReservas)}
          sub="Últimos 6 meses"
          icon={<CalendarDays size={18} />}
          accent
        />
        <StatCard
          title="Ingresos del mes"
          value={isLoading ? "..." : formatCurrency(kpis.ingresosBrutos)}
          sub="ISV incluido"
          icon={<CreditCard size={18} />}
        />
        <StatCard
          title="Canchas activas"
          value={loadingExtras ? "..." : `${canchasActivas}/${totalCanchas}`}
          sub={canchasActivas === totalCanchas ? "Todas disponibles" : `${totalCanchas - canchasActivas} no disponible(s)`}
          icon={<Layers size={18} />}
        />
        <StatCard
          title="Usuarios"
          value={loadingExtras ? "..." : String(usuariosCount)}
          sub="Registrados"
          icon={<Users size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-5">Reservas por mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataMensual} barSize={28}>
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
            <LineChart data={dataMensual}>
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

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-foreground">Reservas recientes</h3>
          <button onClick={() => navigate("/admin/reservas")} className="text-sm text-primary font-medium hover:underline">
            Ver todas
          </button>
        </div>
        <div className="overflow-x-auto">
          {loadingRecientes ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
              <Loader2 size={16} className="animate-spin" /> Cargando reservas...
            </div>
          ) : reservasRecientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No hay reservas registradas.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["ID", "Cliente", "Cancha", "Fecha", "Estado", "Total"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservasRecientes.map((r) => (
                  <tr key={r.reservaId} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.reservaId}</td>
                    <td className="px-5 py-3.5 font-medium">
                      {r.cliente ? `${r.cliente.primerNombre} ${r.cliente.primerApellido}` : `Usuario #${r.usuarioId}`}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {r.canchas || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {r.fechas || "—"} {r.horaInicio ? `· ${r.horaInicio.slice(0, 5)}–${r.horaFin.slice(0, 5)}` : ""}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={`${estadoStyle[r.estadoReserva.toLowerCase() as ReservationStatus]} border-transparent`}>
                        {estadoLabel[r.estadoReserva.toLowerCase() as ReservationStatus]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;