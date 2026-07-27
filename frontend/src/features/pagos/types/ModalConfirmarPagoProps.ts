import type { PagoPendiente } from "./PagoPendiente";

export interface ModalConfirmarPagoProps {
  pago: PagoPendiente | null;
  metodoPagoNombre: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}