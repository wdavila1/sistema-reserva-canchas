import { useState } from "react";
import { ChevronLeft, Check, FileText, CheckCircle, Printer } from "lucide-react";

//TYPES
import type { Reservacion } from "../../types/reservation/Reservacion";

//MOCKS
import { RESERVACIONES } from "../../mocks/reservaciones";

//UTILS
import { formatCurrency } from "../../utils/formatCurrency";

//COMPONENTS
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input";

//HOOKS
import { usePagosPendientes } from "@/hooks/usePagos";
import type { PagosPendientes } from "@/types/pagos/PagosPendientes";

function AdminPagos() {
  const [showFactura, setShowFactura] = useState<Reservacion | null>(null);
  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [rtnCliente, setRtnCliente] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const {pagosPendientes,loading,refetch,} = usePagosPendientes();
  const pagadas = RESERVACIONES.filter((r) => r.pagado);

  const registrar = (p : PagosPendientes) => {
    setSuccessId(p.idReserva);
    setTimeout(() => setSuccessId(null), 3000);
  };

  if (showFactura) {
    const r = showFactura;
    const facturaNum = "00001-0001-00000042";
    const cai = "A2B3C4-D5E6F7-G8H9I0-J1K2L3-M4N5O6-PQ";
    return (
      <div className="space-y-4">
        <button onClick={() => setShowFactura(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={14} /> Volver a Pagos
        </button>
        <div className="bg-white rounded-2xl border border-border p-8 max-w-lg mx-auto font-mono text-sm">
          <div className="text-center border-b border-dashed border-border pb-5 mb-5">
            <p className="text-xl font-black text-foreground not-italic" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Nombre Sitio HN
            </p>
            <p className="text-xs text-muted-foreground">Complejo Deportivo</p>
            <p className="text-xs text-muted-foreground">Col. Lomas del Guijarro, Tegucigalda, Honduras</p>
            <p className="text-xs text-muted-foreground">RTN: 08011993000000 · Tel: +504 2221-3344</p>
          </div>
          <div className="text-center mb-5">
            <p className="font-bold text-foreground not-italic text-base uppercase">
              {rtnCliente ? "Factura con RTN" : "Factura de Consumidor Final"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">No. Correlativo: {facturaNum}</p>
            <p className="text-xs text-muted-foreground">CAI: {cai}</p>
            <p className="text-xs text-muted-foreground">Rango autorizado: 00001-0001-00000001 al 00001-0001-00001000</p>
            <p className="text-xs text-muted-foreground">Fecha límite de emisión: 31/12/2026</p>
          </div>
          <div className="border-b border-dashed border-border pb-4 mb-4 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span>{new Date().toLocaleDateString("es-HN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span>{nombreCliente || r.usuario}</span>
            </div>
            {rtnCliente && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">RTN Cliente:</span>
                <span>{rtnCliente}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reserva:</span>
              <span>{r.id}</span>
            </div>
          </div>
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="border-b border-dashed border-border">
                <th className="text-left pb-2 font-semibold">Descripción</th>
                <th className="text-right pb-2 font-semibold">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1.5 pr-4">
                  Alquiler de {r.cancha}<br />
                  <span className="text-muted-foreground">{r.fecha} · {r.horaInicio}–{r.horaFin} ({r.horas}h)</span>
                </td>
                <td className="py-1.5 text-right">{formatCurrency(r.subtotal)}</td>
              </tr>
            </tbody>
          </table>
          <div className="border-t border-dashed border-border pt-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal (exento ISV):</span>
              <span>{formatCurrency(r.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ISV (15%):</span>
              <span>{formatCurrency(r.isv)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm not-italic border-t border-dashed border-border pt-2 mt-1">
              <span>TOTAL A PAGAR:</span>
              <span className="text-primary">{formatCurrency(r.total)}</span>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 border-t border-dashed border-border pt-4">
            La original de esta factura debe ser conservada<br />por el contribuyente mientras no esté prescrita.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setShowFactura(null)}>
            <ChevronLeft size={16} /> Volver
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer size={16} /> Imprimir
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Pagos & Facturación
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Registra cobros y emite facturas con ISV Honduras</p>
      </div>

      {successId && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-3 text-sm font-medium">
          <CheckCircle size={18} /> Pago registrado para la reserva {successId}
        </div>
      )}

      {/* Pending payments */}
      <div>
        <h2 className="font-bold text-lg text-foreground mb-4">Pagos pendientes ({pagosPendientes.length})</h2>
        <div className="space-y-3">
          {pagosPendientes.map((p) => (
            <div key={p.idReserva} className="bg-white rounded-2xl border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-foreground">{p.nombreUsuario}</span>
                  <span className="font-mono text-xs text-muted-foreground">{p.idReserva}</span>
                </div>
                <p className="text-sm text-muted-foreground">{p.canchaReservada} · {p.fechaReserva.toLocaleDateString()} · {p.horaInicio}–{p.horaFin}</p>
              </div>
              <div className="text-right sm:text-left">
                <p className="text-xl font-black text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{formatCurrency(p.total)}</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <select
                  className="text-sm px-3 py-2 rounded-lg border border-border bg-muted focus:outline-none"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  {["Tarjeta", "Efectivo", "Transferencia", "BAC Móvil"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <Button size="sm" variant="primary" onClick={() => registrar(p)}>
                  <Check size={14} /> Registrar pago
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setNombreCliente(p.nombreUsuario);
                  setShowFactura(p);
                }}>
                  <Printer size={14} /> Factura
                </Button>
              </div>
            </div>
          ))}
          {pagosPendientes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm bg-white rounded-2xl border border-border">
              No hay pagos pendientes. ✓
            </div>
          )}
        </div>
      </div>

      {/* RTN input for business invoices */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="font-bold mb-3">Opciones de factura con RTN</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre del cliente (para factura)"
            placeholder="Empresa o persona"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
          <Input
            label="RTN del cliente (opcional)"
            placeholder="00000000000000"
            value={rtnCliente}
            onChange={(e) => setRtnCliente(e.target.value)}
          />
        </div>
      </div>

      {/* Recent paid */}
      <div>
        <h2 className="font-bold text-lg text-foreground mb-4">Pagos registrados recientes</h2>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Reserva", "Cliente", "Cancha", "Fecha", "Total", "Método", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagadas.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="px-5 py-3.5 font-medium">{r.usuario}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{r.cancha.split("—")[0].trim()}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.fecha}</td>
                    <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(r.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {r.metodoPago}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => { setNombreCliente(r.usuario); setShowFactura(r); }}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <FileText size={13} /> Ver factura
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPagos;