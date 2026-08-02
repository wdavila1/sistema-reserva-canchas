import { Router } from "express";
import * as reportesController from "./reportes.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

const soloAdmin = [verificarToken, requiereRol(["Administrador"])];

router.get("/kpis",                 soloAdmin, reportesController.getKpis);
router.get("/reservas-por-periodo", soloAdmin, reportesController.getReservasPorPeriodo);
router.get("/canchas-mas-usadas",   soloAdmin, reportesController.getCanchasMasUsadas);
router.get("/reservas-hoy", soloAdmin, reportesController.getReservasHoy);

export default router;
