import { useState } from "react";
import { Download, } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

//MOCKS
import { DATA_MENSUAL } from "@/shared/mocks/dataMensual";
import { DATA_CANCHAS } from "@/shared/mocks/dataCanchas";

//UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";

//COMPONENTS
import { Button } from "@/shared/components/ui/Button";

function AdminReportes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Reportes
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Enero – Junio 2026</p>
        </div>
        <Button variant="outline">
          <Download size={15} /> Exportar PDF
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total reservas", value: "314", sub: "Ene – Jun 2026" },
          { title: "Ingresos brutos", value: "L. 130,100", sub: "Incluye ISV" },
          { title: "ISV recaudado", value: "L. 16,970", sub: "15% sobre base" },
          { title: "Ingresos netos", value: "L. 113,130", sub: "Sin ISV" },
        ].map((s) => (
          <div key={s.title} className="bg-white rounded-2xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-2">{s.title}</p>
            <p className="text-2xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Reservations per month */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Reservas por mes</h3>
          <p className="text-sm text-muted-foreground mb-5">Enero – Junio 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DATA_MENSUAL} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }} />
              <Bar dataKey="reservas" fill="#0d7a3e" radius={[6, 6, 0, 0]} name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue per month */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Ingresos mensuales</h3>
          <p className="text-sm text-muted-foreground mb-5">Lempiras (L.) — ISV incluido</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DATA_MENSUAL}>
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

        {/* Courts usage */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Canchas más usadas</h3>
          <p className="text-sm text-muted-foreground mb-5">Reservas acumuladas</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DATA_CANCHAS} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f4ec" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#5c7a68" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cancha" tick={{ fontSize: 12, fill: "#5c7a68" }} width={68} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e6f4ec", fontSize: 13 }} />
              <Bar dataKey="reservas" fill="#0d7a3e" radius={[0, 6, 6, 0]} name="Reservas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-5">Resumen de ingresos por cancha</h3>
          <div className="space-y-3">
            {[
              { cancha: "Fútbol 5 Norte", reservas: 85, ingreso: 34000 },
              { cancha: "Fútbol 5 Sur", reservas: 72, ingreso: 29700 },
              { cancha: "Baloncesto", reservas: 45, ingreso: 14850 },
              { cancha: "Tenis A", reservas: 38, ingreso: 14060 },
              { cancha: "Voleibol", reservas: 30, ingreso: 7700 },
              { cancha: "Pádel", reservas: 22, ingreso: 7590 },
            ].map((item) => {
              const pct = Math.round((item.reservas / 85) * 100);
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReportes;