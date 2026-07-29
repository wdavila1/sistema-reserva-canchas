import { Download, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

import { useReportes } from "@/features/reportes/hooks/useReportes";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { generarReportePdf } from "@/shared/utils/reportePDF";
import { Button } from "@/shared/components/ui/Button";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
function formatPeriodo(p: string) {
  const [y, m] = p.split("-");
  return `${MESES[Number(m) - 1]} ${y}`;
}

function AdminReportes() {
  const { kpis, porPeriodo, canchas, rango, isLoading, error } = useReportes();

  const dataMensual = porPeriodo.map((p) => ({
    mes: formatPeriodo(p.periodo),
    reservas: p.reservas,
    ingresos: p.ingresos,
  }));

  const dataCanchas = canchas.map((c) => ({
    cancha: c.cancha,
    reservas: c.reservas,
    ingreso: c.ingreso,
  }));

  const maxReservas = Math.max(...dataCanchas.map((c) => c.reservas), 1);

  const subtitulo = isLoading
    ? "Cargando..."
    : `Período: ${rango.fechaInicio}  →  ${rango.fechaFin}`;

  const handleExportPdf = () => {
    if (isLoading || error) return;
    generarReportePdf({ kpis, porPeriodo, canchas, rango });
  };

  const chartHeightCanchas = Math.max(220, dataCanchas.length * 35 + 60);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Reportes
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{subtitulo}</p>
        </div>
        <Button variant="outline" onClick={handleExportPdf} disabled={isLoading || !!error}>
          <Download size={15} /> Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total reservas", value: kpis.totalReservas.toString(), sub: "En el período" },
          { title: "Ingresos brutos", value: formatCurrency(kpis.ingresosBrutos), sub: "Incluye ISV" },
          { title: "ISV recaudado", value: formatCurrency(kpis.isv), sub: "15% sobre base" },
          { title: "Ingresos netos", value: formatCurrency(kpis.ingresosNetos), sub: "Sin ISV" },
        ].map((s) => (
          <div key={s.title} className="bg-white rounded-2xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-2">{s.title}</p>
            <p className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Reservas por mes</h3>
          <p className="text-sm text-muted-foreground mb-5">{subtitulo}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataMensual} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }} />
              <Bar dataKey="reservas" fill="#0d7a3e" radius={[6, 6, 0, 0]} name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Ingresos mensuales</h3>
          <p className="text-sm text-muted-foreground mb-5">Lempiras (L.) — ISV incluido</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }}
                formatter={(v: number) => [`L. ${v.toLocaleString("es-HN")}`, "Ingresos"]}
              />
              <Line type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 5 }} name="Ingresos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Canchas más usadas</h3>
          <p className="text-sm text-muted-foreground mb-5">Reservas acumuladas</p>
          <ResponsiveContainer width="100%" height={chartHeightCanchas}>
            <BarChart data={dataCanchas} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cancha" tick={{ fontSize: 12, fill: "#5c7a68" }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }} />
              <Bar dataKey="reservas" fill="#0d7a3e" radius={[0, 6, 6, 0]} name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-5">Resumen de ingresos por cancha</h3>
          <div className="space-y-3">
            {dataCanchas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay datos para el período seleccionado.
              </p>
            ) : (
              dataCanchas.map((item) => {
                const pct = Math.round((item.reservas / maxReservas) * 100);
                return (
                  <div key={item.cancha}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{item.cancha}</span>
                      <span className="text-primary font-semibold font-mono">{formatCurrency(item.ingreso)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.reservas} reservas</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReportes;