import type { Paginacion } from "@/shared/types/Paginacion";
import type { PagoPendiente } from "./PagoPendiente";

export interface PagoPendienteResponse {
  data: PagoPendiente[];
  pagination: Paginacion;
}