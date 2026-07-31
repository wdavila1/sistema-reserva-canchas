import { X, Printer } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { ModalVerFacturaProps } from "../types/ModalVerFacturaProps";

export function ModalVerFactura({ factura, onCerrar, onImprimir }: ModalVerFacturaProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Factura</h2>
              <p className="text-xs text-gray-500 font-mono">N° {factura.numerofactura}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onImprimir}
              className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Printer size={16} className="mr-1" /> Imprimir
            </Button>
            <button
              onClick={onCerrar}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido de la factura con estilo documento */}
        <div className="p-8" id="factura-para-imprimir">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-3xl mx-auto">
            {/* Datos del emisor*/}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gray-300 pb-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{factura.razonsocial}</h1>
                <p className="text-sm text-gray-600 mt-1">{factura.direccion}</p>
              </div>
              <div className="text-right text-sm space-y-1 mt-2 sm:mt-0">
                <p><span className="text-gray-500">RTN:</span> <span className="font-mono">{factura.rtnempresa}</span></p>
                <p><span className="text-gray-500">CAI:</span> <span className="font-mono">{factura.cai}</span></p>
                <p><span className="text-gray-500">Rango:</span> <span className="font-mono">{factura.rangoautorizado}</span></p>
                <p><span className="text-gray-500">Vence:</span> <span className="font-mono">{factura.fechafin}</span></p>
              </div>
            </div>

            {/* Datos del cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</span>
                <span className="text-gray-800 font-medium">{factura.rtncliente || "Consumidor final"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha emisión</span>
                <span className="text-gray-800">{factura.fechaemision}</span>
              </div>
            </div>

            {/* Detalle de los servicios */}
            <div className="mb-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicio</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-800">{factura.servicioadquirido}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-800">{factura.subtotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detalle de venta */}
            <div className="flex flex-col items-end space-y-1 pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between w-48 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-mono">{factura.subtotal}</span>
              </div>
              <div className="flex justify-between w-48 text-sm">
                <span className="text-gray-500">ISV 15%</span>
                <span className="font-mono">{factura.isv}</span>
              </div>
              {Number(factura.exoneracion) > 0 && (
                <div className="flex justify-between w-48 text-sm text-green-600">
                  <span>Exoneración</span>
                  <span className="font-mono">-{factura.exoneracion}</span>
                </div>
              )}
              <div className="flex justify-between w-48 text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-blue-600">{factura.total}</span>
              </div>
            </div>

            <div className="mt-6 text-xs text-center text-gray-400 border-t border-gray-100 pt-4">
              <p>Gracias por su preferencia</p>
              <p className="font-mono text-gray-300">Factura generada electrónicamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}