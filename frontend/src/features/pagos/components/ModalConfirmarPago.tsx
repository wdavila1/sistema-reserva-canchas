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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="bg-primary px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
          <h2 className="font-[family-name:var(--font-headline-lg)] text-primary-foreground text-2xl uppercase tracking-wide relative">
            Confirmar pago
          </h2>
          <p className="font-[family-name:var(--font-body-md)] text-primary-foreground/70 text-sm mt-1 relative">
            Revisa los detalles antes de continuar
          </p>
        </div>

        <div className="px-6 py-5 space-y-2.5">
          {[
            ["Cliente", pago.nombreusuario],
            ["Reserva", `#${pago.idreserva}`],
            ["Cancha", pago.canchareservada],
            ["Horario", `${pago.horainicio} - ${pago.horafin}`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center bg-muted/50 rounded-lg px-3 py-2"
            >
              <span className="font-[family-name:var(--font-label-sm)] text-xs text-muted-foreground uppercase tracking-wide">
                {label}
              </span>
              <span className="font-[family-name:var(--font-body-md)] text-sm text-foreground font-medium text-right">
                {value}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center bg-accent rounded-lg px-3 py-3 mt-3">
            <span className="font-[family-name:var(--font-label-sm)] text-xs text-accent-foreground uppercase tracking-wide">
              Monto
            </span>
            <span className="font-[family-name:var(--font-data-display)] text-xl font-bold text-accent-foreground">
              {formatCurrency(Number(pago.total))}
            </span>
          </div>

          <div className="flex justify-between items-center px-1 pt-2">
            <span className="font-[family-name:var(--font-label-sm)] text-xs text-muted-foreground uppercase tracking-wide">
              Método de pago
            </span>
            <span className="font-[family-name:var(--font-body-md)] text-sm text-foreground font-medium">
              {metodoPagoNombre}
            </span>
          </div>

          <p className="font-[family-name:var(--font-body-md)] text-sm text-muted-foreground pt-3 text-center">
            ¿Deseas registrar este pago?
          </p>
        </div>

        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 rounded-xl text-sm text-foreground bg-muted hover:bg-border transition-colors duration-150"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            className="flex-1 py-3 rounded-xl text-sm bg-secondary text-secondary-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150 shadow-lg shadow-secondary/30"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}