import { asyncHandler } from "../../utils/asyncHandler.js";
import * as reportesService from "./reportes.service.js";

export const getKpis = asyncHandler(async (req, res) => {
  const kpis = await reportesService.obtenerKpis(req.query);
  res.json(kpis);
});

export const getReservasPorPeriodo = asyncHandler(async (req, res) => {
  const data = await reportesService.obtenerReservasPorPeriodo(req.query);
  res.json(data);
});

export const getCanchasMasUsadas = asyncHandler(async (req, res) => {
  const data = await reportesService.obtenerCanchasMasUsadas(req.query);
  res.json(data);
});