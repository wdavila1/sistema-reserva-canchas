import type { Paginacion } from "@/shared/types/Paginacion";
import type { PagoConfirmado } from "./PagoConfirmado";

export interface PagoConfirmadoResponse {
    data: PagoConfirmado[];
    pagination: Paginacion;
}