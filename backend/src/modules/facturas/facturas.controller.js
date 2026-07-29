import { asyncHandler } from "../../utils/asyncHandler.js";
import * as facturasService from "./facturas.service.js"

export const generarFactura = asyncHandler(async (req, res) => {
  console.log("1. Entró al controlador");

  const { pagoId, rtn = null, razonSocialCliente = null } = req.body;
  const usuarioEmiteId = req.user?.usuarioId;

  const factura = await facturasService.generarFactura(
    { pagoId, rtn, razonSocialCliente },
    usuarioEmiteId
  );

  res.status(201).json(factura);
});