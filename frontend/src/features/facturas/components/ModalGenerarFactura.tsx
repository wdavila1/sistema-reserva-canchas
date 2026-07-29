import { useState } from "react";
import { FilePlus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ModalGenerarFacturaProps } from "../types/ModalGenerarFacturaProps";

export function ModalGenerarFactura({ pago, onCancelar, onConfirmar }: ModalGenerarFacturaProps) {
    const [rtn, setRtn] = useState("");
    const [razonSocial, setRazonSocial] = useState("");

    //para evitar lo de que el forms recargue la pagina
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirmar(pago.pagoid, rtn, razonSocial);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Generar Factura</h2>
                    <button
                        onClick={onCancelar}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Reserva:</span>
                            <span className="font-mono text-gray-700">#{pago.reservaid}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Cliente:</span>
                            <span className="font-medium text-gray-800">{pago.nombreusuario}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Cancha:</span>
                            <span className="text-gray-700">{pago.canchareservada.split("—")[0].trim()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Fecha:</span>
                            <span className="text-gray-700">{pago.fechapago}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total:</span>
                            <span className="font-bold text-blue-600">{formatCurrency(Number(pago.total))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Método:</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {pago.metodopago}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label htmlFor="rtn" className="block text-sm font-medium text-gray-700 mb-1">
                                RTN (opcional)
                            </label>
                            <input
                                id="rtn"
                                type="text"
                                value={rtn}
                                onChange={(e) => setRtn(e.target.value)}
                                placeholder="Ej: 12345678901234"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                maxLength={14}
                            />
                        </div>
                        <div>
                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 mb-1">
                                Razón Social (opcional)
                            </label>
                            <input
                                id="razonSocial"
                                type="text"
                                value={razonSocial}
                                onChange={(e) => setRazonSocial(e.target.value)}
                                placeholder="Ej: Juan Pérez S.A."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* aca se har el request */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
                        <Button type="button" variant="outline" onClick={onCancelar}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            <FilePlus size={16} className="mr-2" /> Generar Factura
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}