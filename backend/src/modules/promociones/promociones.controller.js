import { asyncHandler } from "../../utils/asyncHandler.js";
import * as promocionesService from "./promociones.service.js";

// GET /promociones  → solo admin
export const obtenerTodasLasPromociones = asyncHandler(async (req, res) => {
  const promociones = await promocionesService.obtenerTodasLasPromociones();
  res.status(200).json(promociones);
});

// GET /promociones/activas  → pública (usada al mostrar precios con descuento)
export const obtenerPromocionesActivas = asyncHandler(async (req, res) => {
  const promociones = await promocionesService.obtenerPromocionesActivas();
  res.status(200).json(promociones);
});

// GET /promociones/:id
export const obtenerPromocionPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const promo = await promocionesService.obtenerPromocionPorId(Number(id));
  res.status(200).json(promo);
});

// POST /promociones  → solo admin
export const crearPromocion = asyncHandler(async (req, res) => {
  const promo = await promocionesService.crearPromocion(req.body);
  res.status(201).json({ mensaje: "Promoción creada correctamente.", promocion: promo });
});

// PUT /promociones/:id  → solo admin
export const actualizarPromocion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const promo = await promocionesService.actualizarPromocion(Number(id), req.body);
  res.status(200).json({ mensaje: "Promoción actualizada.", promocion: promo });
});

// DELETE /promociones/:id  → solo admin (desactiva, no elimina)
export const eliminarPromocion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await promocionesService.eliminarPromocion(Number(id));
  res.status(200).json({ mensaje: "Promoción desactivada correctamente." });
});
