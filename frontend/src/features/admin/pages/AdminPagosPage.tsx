import { useState } from "react";
import { Check, CheckCircle, FilePlus, ReceiptText, Calendar, Clock, MapPin, X, FileText } from "lucide-react";

// UTILS
import { formatCurrency } from "@/shared/utils/formatCurrency";

// COMPONENTS
import { Button } from "@/shared/components/ui/Button";
import { ModalConfirmarPago } from "@/features/pagos/components/ModalConfirmarPago";
import { ModalGenerarFactura } from "@/features/facturas/components/ModalGenerarFactura";

// TYPES
import type { PagoPendiente } from "@/features/pagos/types/PagoPendiente";

// HOOKS
import { usePagosPendientes } from "@/features/pagos/hooks/usePagosPendiente";
import { usePagosConfirmados } from "@/features/pagos/hooks/usePagosConfirmado";
import { useMetodosPago } from "@/features/pagos/hooks/useMetodosPago";
import { useRegistrarPago } from "@/features/pagos/hooks/useRegistrarPago";
import { useGenerarFactura } from "@/features/facturas/hooks/useGenerarFactura";
import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";
import { useVerFactura } from "@/features/facturas/hooks/useVerFactura";
import { ModalVerFactura } from "@/features/facturas/components/ModalVerFactura";

function AdminPagos() {
  // Estados locales
  const [toast, setToast] = useState<{ id: number; message: string; visible: boolean } | null>(null);
  const [metodosPagoSeleccionados, setMetodosPagoSeleccionados] = useState<Record<number, number>>({});
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);
  const [pagoParaFactura, setPagoParaFactura] = useState<PagoConfirmado | null>(null);
  const [pagoIdParaFactura, setPagoIdParaFactura] = useState<number | null>(null);

  // Hooks con paginación
  const {
    pagosPendientes,
    loading: loadingPendientes,
    pagination: paginationPendientes,
    nextPage: nextPagePendientes,
    prevPage: prevPagePendientes,
    setLimit: setLimitPendientes,
    refetch: refetchPendientes,
  } = usePagosPendientes(1, 5);

  // Para la sección "Pagos pendientes de facturación" (facturado = false)
  const {
    pagosConfirmados: pagosSinFactura,
    loading: loadingSinFactura,
    pagination: paginationSinFactura,
    nextPage: nextPageSinFactura,
    prevPage: prevPageSinFactura,
    setLimit: setLimitSinFactura,
    refetch: refetchSinFactura,
  } = usePagosConfirmados(1, 5, false);

  // Para la sección "Facturas emitidas" (facturado = true)
  const {
    pagosConfirmados: pagosConFactura,
    loading: loadingConFactura,
    pagination: paginationConFactura,
    nextPage: nextPageConFactura,
    prevPage: prevPageConFactura,
    setLimit: setLimitConFactura,
    refetch: refetchConFactura,
  } = usePagosConfirmados(1, 5, true);

  //Para abrir la modal que muestra la Factura
  const { factura, loading, error } = useVerFactura(pagoIdParaFactura ?? 0);

  const { registrar } = useRegistrarPago(refetchPendientes, refetchSinFactura);
  const { generar } = useGenerarFactura(refetchSinFactura, refetchConFactura);
  const { metodosPago } = useMetodosPago();

  const confirmarRegistroPago = async () => {
    if (!pagoSeleccionado) return;
    const metodoPagoId = metodosPagoSeleccionados[pagoSeleccionado.idreserva] ?? metodosPago[0]?.metodopagoid;
    if (!metodoPagoId) return;
    try {
      await registrar(pagoSeleccionado.idreserva, metodoPagoId);
      setPagoSeleccionado(null);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmarGenerarFactura = async (pagoId: number, rtn: string, razonSocial: string, aplicaExoneracion: boolean) => {
    try {
      await generar(Number(pagoId), rtn, razonSocial, aplicaExoneracion);
      setPagoParaFactura(null);
    } catch (error) {
      console.error(error);
    }
  };

  const verFactura = async (pagoId: number) => {
    try {
      await verFactura(pagoId);
    } catch (error) {
      console.log(error);
    }
  }

  const metodoPagoId = pagoSeleccionado
    ? metodosPagoSeleccionados[pagoSeleccionado.idreserva] ?? metodosPago[0]?.metodopagoid
    : 0;
  const metodoPagoNombre = metodosPago.find((m) => m.metodopagoid === metodoPagoId)?.metodopago ?? "";

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      {toast?.visible && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-3 text-sm font-medium shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 max-w-md">
          <CheckCircle size={18} />
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Pagos & Facturación
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Registra cobros y emite facturas con ISV Honduras</p>
      </div>

      {/* pagos pendientes */}
      <div>
        <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          Pagos pendientes{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({paginationPendientes.totalItems})
          </span>
        </h2>

        <div className="space-y-4">
          {loadingPendientes ? (
            <div className="text-center py-8 text-gray-500">Cargando pagos pendientes...</div>
          ) : pagosPendientes.length > 0 ? (
            pagosPendientes.map((p) => (
              <div
                key={p.idreserva}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow"
              >
                {/* contenido de cada item */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-800 truncate">{p.nombreusuario}</span>
                    <span className="font-mono text-xs text-gray-400">#{p.idreserva}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {p.fechareserva}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {p.horainicio}–{p.horafin}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {p.canchareservada}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <p className="text-xl font-black text-blue-600" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {formatCurrency(Number(p.total))}
                  </p>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <select
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
                      value={metodosPagoSeleccionados[p.idreserva] ?? 0}
                      onChange={(e) =>
                        setMetodosPagoSeleccionados({
                          ...metodosPagoSeleccionados,
                          [p.idreserva]: Number(e.target.value),
                        })
                      }
                    >
                      {metodosPago.map((metodo) => (
                        <option key={metodo.metodopagoid} value={metodo.metodopagoid}>
                          {metodo.metodopago}
                        </option>
                      ))}
                    </select>
                    <Button size="sm" variant="primary" onClick={() => setPagoSeleccionado(p)}>
                      <Check size={14} className="mr-1" /> Registrar pago
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <ReceiptText className="mx-auto text-gray-300" size={48} />
              <p className="mt-2 text-gray-500 text-sm">No hay pagos pendientes por el momento. ✓</p>
            </div>
          )}
        </div>

        {/* controles de paginacion*/}
        {paginationPendientes.totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
            {/* Selector de limite de items por paginacion */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Mostrar</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                value={paginationPendientes.limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setLimitPendientes(newLimit);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>registros por página</span>
            </div>

            {/* botones de navegacion (solo si hay más de una pqgina) */}
            {paginationPendientes.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Página {paginationPendientes.page} de {paginationPendientes.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!paginationPendientes.hasPreviousPage}
                  onClick={prevPagePendientes}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!paginationPendientes.hasNextPage}
                  onClick={nextPagePendientes}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        )}

        <ModalConfirmarPago
          pago={pagoSeleccionado}
          metodoPagoNombre={metodoPagoNombre}
          onCancelar={() => setPagoSeleccionado(null)}
          onConfirmar={confirmarRegistroPago}
        />
      </div>

      {/* pagos confirmados sin facturacion*/}
      <div>
        <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          Pagos pendientes de facturación{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({paginationSinFactura.totalItems})
          </span>
        </h2>

        {loadingSinFactura ? (
          <div className="text-center py-8 text-gray-500">Cargando pagos confirmados...</div>
        ) : pagosSinFactura.length > 0 ? (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Reserva", "Cliente", "Cancha", "Fecha", "Total", "Método", ""].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Total" || h === "" ? "text-right" : "text-left"
                            }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagosSinFactura.map((p) => (
                      <tr key={p.reservaid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{p.reservaid}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">{p.nombreusuario}</td>
                        <td className="px-5 py-3.5 text-gray-600">{p.canchareservada.split("—")[0].trim()}</td>
                        <td className="px-5 py-3.5 text-gray-600">{p.fechapago}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-blue-600">
                          {formatCurrency(Number(p.total))}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {p.metodopago}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setPagoParaFactura(p)}>
                            <FilePlus size={14} className="mr-1" /> Generar Factura
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/*controles de paginacion*/}
            {paginationSinFactura.totalItems > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                {/* Selector de límite */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Mostrar</span>
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                    value={paginationSinFactura.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setLimitSinFactura(newLimit);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>registros por página</span>
                </div>

                {/* botones de navegacion */}
                {paginationSinFactura.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Página {paginationSinFactura.page} de {paginationSinFactura.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!paginationSinFactura.hasPreviousPage}
                      onClick={prevPageSinFactura}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!paginationSinFactura.hasNextPage}
                      onClick={nextPageSinFactura}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <ReceiptText className="mx-auto text-gray-300" size={48} />
            <p className="mt-2 text-gray-500 text-sm">No hay pagos pendientes de facturación. ✓</p>
          </div>
        )}
        {pagoParaFactura && (
          <ModalGenerarFactura
            pago={pagoParaFactura}
            onCancelar={() => setPagoParaFactura(null)}
            onConfirmar={confirmarGenerarFactura}
          />
        )}
      </div>

      {/* facturas emitidas */}
      <div>
        <h2 className="font-bold text-lg text-foreground mb-4">Facturas emitidas</h2>
        {loadingConFactura ? (
          <div className="text-center py-8 text-gray-500">Cargando pagos confirmados...</div>
        ) : pagosConFactura.length > 0 ? (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Reserva", "Cliente", "Cancha", "Fecha", "Total", "Método", ""].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Total" || h === "" ? "text-right" : "text-left"
                            }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagosConFactura.map((p) => (
                      <tr key={p.reservaid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{p.reservaid}</td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">{p.nombreusuario}</td>
                        <td className="px-5 py-3.5 text-gray-600">{p.canchareservada.split("—")[0].trim()}</td>
                        <td className="px-5 py-3.5 text-gray-600">{p.fechapago}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-blue-600">
                          {formatCurrency(Number(p.total))}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {p.metodopago}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setPagoIdParaFactura(p.pagoid)}>
                            <FileText size={14} className="mr-1" /> Ver Factura
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* C */}
            {paginationConFactura.totalItems > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                {/* selector de limite */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Mostrar</span>
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                    value={paginationConFactura.limit}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setLimitConFactura(newLimit);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>registros por página</span>
                </div>

                {/* botones de navegacion */}
                {paginationConFactura.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Página {paginationConFactura.page} de {paginationConFactura.totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!paginationConFactura.hasPreviousPage}
                      onClick={prevPageConFactura}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!paginationConFactura.hasNextPage}
                      onClick={nextPageConFactura}
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <ReceiptText className="mx-auto text-gray-300" size={48} />
            <p className="mt-2 text-gray-500 text-sm">Aún no se han emitido facturas.</p>
          </div>
        )}
        {pagoIdParaFactura && (
          <>
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <p className="text-gray-600">Cargando factura...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md">
                  <p className="text-red-600">Error al cargar la factura: {error.message}</p>
                  <button
                    onClick={() => setPagoIdParaFactura(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
            {factura && !loading && (
              <ModalVerFactura
                factura={factura}
                onCerrar={() => setPagoIdParaFactura(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPagos;