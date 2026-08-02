import { Router } from "express";
import * as pagosController from "../controller/pagos.controller.js"
import { verificarToken } from "../../../middlewares/auth.middleware.js";
import { requiereRol } from "../../../middlewares/roles.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/pendientes",requiereRol(["Administrador"]), pagosController.obtenerPagosPendientes)
router.get("/confirmados",requiereRol(["Administrador"]) ,pagosController.obtenerPagosConfirmados)
router.post("/registrar", requiereRol(["Administrador"]), pagosController.registrarPago)

export default router;