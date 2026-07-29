import { Router } from "express";
import * as facturasController from "./facturas.controller.js"
import { verificarToken } from "../../middlewares/auth.middleware.js"

const router = Router();

router.use(verificarToken);

router.post("/generar", facturasController.generarFactura)

export default router;