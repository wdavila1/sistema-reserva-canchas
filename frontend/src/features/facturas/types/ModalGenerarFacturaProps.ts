import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";

export interface ModalGenerarFacturaProps {
    pago: PagoConfirmado;
    onCancelar: () => void;
    onConfirmar: (pagoId: number, rtn: string, razonSocial: string) => void;
}