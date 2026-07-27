import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ModalConfirmarPagoProps } from "../types/ModalConfirmarPagoProps";

export function ModalConfirmarPago({
  pago,
  metodoPagoNombre,
  onConfirmar,
  onCancelar,
}: ModalConfirmarPagoProps) {
  if (!pago) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Confirmar pago
        </h2>

        <div className="space-y-2 text-sm">
          <p><strong>Cliente:</strong> {pago.nombreusuario}</p>
          <p><strong>Reserva:</strong> #{pago.idreserva}</p>
          <p><strong>Cancha:</strong> {pago.canchareservada}</p>
          <p><strong>Horario:</strong> {pago.horainicio} - {pago.horafin}</p>
          <p><strong>Monto:</strong> {formatCurrency(Number(pago.total))}</p>
          <p><strong>Método de pago:</strong> {metodoPagoNombre}</p>
        </div>

        <p className="mt-5 text-sm text-gray-600">
          ¿Deseas registrar este pago?
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancelar}>
            Cancelar
          </button>

          <button onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}