import { asyncHandler } from "../../utils/asyncHandler.js";
import * as reportesService from "./reportes.service.js";

export const getKpis = asyncHandler(async (req, res) => {
  const kpis = await reportesService.obtenerKpis();
  res.json(kpis);
});

export const getReservasPorPeriodo = asyncHandler(async (req, res) => {
  const data = await reportesService.obtenerReservasPorPeriodo();
  res.json(data);
});

export const getCanchasMasUsadas = asyncHandler(async (req, res) => {
  const data = await reportesService.obtenerCanchasMasUsadas();
  res.json(data);
});