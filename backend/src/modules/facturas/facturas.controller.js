import { asyncHandler } from "../../utils/asyncHandler.js";
import * as facturasService from "./facturas.service.js"

export const generarFactura = asyncHandler(async (req, res) => {

  const { pagoId, rtn = null, razonSocialCliente = null, aplicaExoneracion = false } = req.body;
  const usuarioEmiteId = req.user?.usuarioId;

  const factura = await facturasService.generarFactura({ pagoId, rtn, razonSocialCliente, aplicaExoneracion }, usuarioEmiteId);

  res.status(201).json(factura);
});

export const obtenerDetalleFactura = asyncHandler(async (req, res) => {
  let { pagoId }= req.query;
  const pagoid = Math.max(Number(pagoId), 1);
  console.log(pagoid)
  const detalleFactura = await facturasService.obtenerDetalleFactura(pagoid);
  res.status(201).json(detalleFactura)
})