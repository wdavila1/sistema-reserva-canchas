export interface Kpis {
  totalReservas: number;
  ingresosBrutos: number;
  isv: number;
  ingresosNetos: number;
}

export interface ReservasPorPeriodoItem {
  periodo: string;
  reservas: number;
  ingresos: number;
}

export interface CanchaMasUsadaItem {
  canchaId: number;
  cancha: string;
  reservas: number;
  ingreso: number;
}

export interface Rango {
  fechaInicio: string;
  fechaFin: string;
}