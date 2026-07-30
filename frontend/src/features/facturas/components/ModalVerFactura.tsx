import { X, Printer } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ModalVerFacturaProps } from "../types/ModalVerFacturaProps";

export function ModalVerFactura({ factura, onCerrar, onImprimir }: ModalVerFacturaProps) {
    const toNumber = (val: string) => parseFloat(val) || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        Factura #{factura.numerofactura}
                    </h2>
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

                {/* Cuerpo de la factura */}
                <div id="factura-para-imprimir" className="p-6 space-y-6">
                    {/* Datos de la empresa */}
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Razón Social</span>
                            <span className="text-gray-800 font-medium">{factura.razonsocial}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">RTN Empresa</span>
                            <span className="font-mono text-gray-800">{factura.rtnempresa}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Dirección</span>
                            <span className="text-gray-800">{factura.direccion}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">CAI</span>
                            <span className="font-mono text-gray-800">{factura.cai}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Rango Autorizado</span>
                            <span className="font-mono text-gray-800">{factura.rangoautorizado}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Fecha Límite CAI</span>
                            <span className="text-gray-800">{factura.fechafin}</span>
                        </div>
                    </div>

                    {/* Datos del cliente y servicio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 font-medium">RTN Cliente</span>
                            <p className="font-mono text-gray-800">{factura.rtncliente || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 font-medium">Fecha Emisión</span>
                            <p className="text-gray-800">{factura.fechaemision}</p>
                        </div>
                        <div className="md:col-span-2">
                            <span className="text-gray-500 font-medium">Servicio Adquirido</span>
                            <p className="text-gray-800">{factura.servicioadquirido}</p>
                        </div>
                    </div>

                    {/* Totales */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-800">{formatCurrency(toNumber(factura.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ISV (15%)</span>
                            <span className="text-gray-800">{formatCurrency(toNumber(factura.isv))}</span>
                        </div>
                        {toNumber(factura.exonercacion) > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Exoneración</span>
                                <span>-{formatCurrency(toNumber(factura.exonercacion))}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-900">Total</span>
                            <span className="text-blue-600">{formatCurrency(toNumber(factura.total))}</span>
                        </div>
                    </div>
                </div>

                {/* Pie con accion*/}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
                    <Button variant="outline" onClick={onCerrar} className="hover:bg-gray-100">
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
}