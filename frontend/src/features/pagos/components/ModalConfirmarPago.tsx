import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import type { ModalConfirmarPagoProps } from "../types/ModalConfirmarPagoProps";

export function ModalConfirmarPago({
  pago,
  metodoPagoNombre,
  onConfirmar,
  onCancelar,
}: ModalConfirmarPagoProps) {
  const [aceptado, setAceptado] = useState(false);

  if (!pago) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl w-full max-w-sm shadow-2xl border border-border/50 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="bg-primary px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
          <h2 className="font-[family-name:var(--font-headline-lg)] text-primary-foreground text-2xl uppercase tracking-wide relative">
            Confirmar pago
          </h2>
          <p className="font-[family-name:var(--font-body-md)] text-primary-foreground/70 text-sm mt-1 relative">
            Revisa los detalles antes de continuar
          </p>
        </div>

        {/* DETALLES DE LA RESERVA */}
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

          <div className="flex justify-between items-center bg-accent rounded-lg px-3 py-3 mt-3 ring-1 ring-secondary/30">
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
        </div>

        {/* CHECKBOX DE TÉRMINOS (Aca es por lo de politicas de no reembolso) */}
        <div className="px-6 pb-4 flex items-start gap-3">
          <div className="flex h-5 items-center">
            <input
              id="aceptar-terminos"
              type="checkbox"
              checked={aceptado}
              onChange={(e) => setAceptado(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 bg-background text-secondary focus:ring-secondary cursor-pointer transition-colors"
            />
          </div>
          <label
            htmlFor="aceptar-terminos"
            className="font-[family-name:var(--font-body-md)] text-sm text-muted-foreground leading-tight cursor-pointer select-none"
          >
            El cliente ha sido informado de que este pago no es reembolsable, según lo{" "}
            <Link
              to="/terminos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-secondary underline transition-colors hover:text-secondary/80 underline-offset-2"
            >
              Términos y Condiciones
            </Link>{" "},
            y autoriza el cargo.
          </label>
        </div>

        {/* BOTONES PARA CANCELAR Y CONFIRMAR LO DEL PAGO */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 rounded-xl text-sm text-foreground bg-muted hover:bg-border transition-colors duration-150"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            disabled={!aceptado}
            className="flex-1 py-3 rounded-xl text-sm bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98] 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-secondary/10"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}