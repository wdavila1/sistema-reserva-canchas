import type { FacturaDetalle } from "./FacturaDetalle";

export interface ModalVerFacturaProps {
    factura : FacturaDetalle
    onCerrar: () => void;
    onImprimir: () => void;
}