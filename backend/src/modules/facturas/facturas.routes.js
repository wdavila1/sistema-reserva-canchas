import { Router } from "express";
import * as facturasController from "./facturas.controller.js"
import { verificarToken } from "../../middlewares/auth.middleware.js"
import { requiereRol } from "../../middlewares/roles.middleware.js"

const router = Router();

router.use(verificarToken);

router.post("/generar", requiereRol(["Administrador"]) ,facturasController.generarFactura)
router.get("/obtener", requiereRol(["Administrador"]), facturasController.obtenerDetalleFactura)

export default router;