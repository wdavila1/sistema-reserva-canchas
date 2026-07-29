import type { PagoConfirmado } from "@/features/pagos/types/PagoConfirmado";

export interface ModalGenerarFacturaProps {
    pago: PagoConfirmado;
    onCancel: () => void;
    onConfirm: (pagoId: string, rtn: string, razonSocial: string) => void;
}