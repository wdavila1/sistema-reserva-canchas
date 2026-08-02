import { Router } from "express";
import * as notificacionesController from "./notificaciones.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/",                     notificacionesController.getMisNotificaciones);
router.patch("/:id/leida",          notificacionesController.marcarLeida);
export default router;