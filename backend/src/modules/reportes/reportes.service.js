import * as reportesRepository from "./reportes.repository.js";

function round2(n) {
  return Number(Number(n ?? 0).toFixed(2));
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function defaultRango() {
  const hoy = new Date();
  const fin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
  return { fechaInicio: toISODate(inicio), fechaFin: toISODate(fin) };
}

function normalizarRango() {
  return defaultRango();
}

// Devuelve los KPIs del dashboard
export async function obtenerKpis() {
  const rango = normalizarRango();
  const row = await reportesRepository.kpisResumen({ ...rango, soloConIngreso: true });
  if (!row) {
    return { totalReservas: 0, ingresosBrutos: 0, isv: 0, ingresosNetos: 0 };
  }
  return {
    totalReservas: row.totalreservas ?? 0,
    ingresosBrutos: round2(row.totalingresos),
    isv: round2(row.isv),
    ingresosNetos: round2(row.ingresosnetos),
  };
}

export async function obtenerReservasPorPeriodo() {
  const rango = normalizarRango();
  const filas = await reportesRepository.obtenerReporteReservasPorPeriodo({ ...rango, soloConIngreso: true });
  return filas.map((f) => ({
    periodo: f.periodo,
    reservas: Number(f.reservas ?? 0),
    ingresos: round2(f.ingresos),
  }));
}

export async function obtenerCanchasMasUsadas() {
  const rango = normalizarRango();
  const filas = await reportesRepository.canchasMasUsadas({ ...rango, soloConIngreso: true });
  return filas.map((f) => ({
    canchaId: f.canchaid,
    cancha: f.nombrecancha,
    reservas: Number(f.cantidadreservas ?? 0),
    ingreso: round2(f.ingresos),
  }));
}
