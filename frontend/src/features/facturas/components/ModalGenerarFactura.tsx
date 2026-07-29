import { useState } from "react";
import { FilePlus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ModalGenerarFacturaProps } from "../types/ModalGenerarFacturaProps";

export function ModalGenerarFactura({ pago, onCancelar, onConfirmar }: ModalGenerarFacturaProps) {
    const [rtn, setRtn] = useState("");
    const [razonSocial, setRazonSocial] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirmar(pago.pagoid, rtn, razonSocial);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Generar Factura</h2>
                    <button
                        onClick={onCancelar}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-gray-50/80 rounded-xl p-4 space-y-2.5 text-sm border border-gray-100">
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Reserva</span>
                            <span className="font-mono text-gray-800 font-medium">#{pago.reservaid}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Cliente</span>
                            <span className="text-gray-800 font-medium">{pago.nombreusuario}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Cancha</span>
                            <span className="text-gray-700">{pago.canchareservada.split("—")[0].trim()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Fecha</span>
                            <span className="text-gray-700">{pago.fechapago}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                            <span className="text-gray-700 font-semibold">Total</span>
                            <span className="font-bold text-blue-600 text-base">{formatCurrency(Number(pago.total))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Método</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                {pago.metodopago}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="rtn" className="block text-sm font-medium text-gray-700 mb-1.5">
                                RTN <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                id="rtn"
                                type="text"
                                value={rtn}
                                onChange={(e) => setRtn(e.target.value)}
                                placeholder="Ej: 12345678901234"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                                maxLength={14}
                            />
                        </div>
                        <div>
                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Razón Social <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                id="razonSocial"
                                type="text"
                                value={razonSocial}
                                onChange={(e) => setRazonSocial(e.target.value)}
                                placeholder="Ej: Juan Pérez S.A."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outline" onClick={onCancelar} className="hover:bg-gray-50">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" className="gap-2">
                            <FilePlus size={16} /> Generar Factura
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}