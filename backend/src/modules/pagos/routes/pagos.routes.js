// Rutas: POST /api/pagos (simular pago), GET /api/pagos/:reservaId
// TODO: implementar.

import { Router } from "express";
import * as pagosController from "../controller/pagos.controller.js"

const router = Router();

router.get("/pendientes", pagosController.obtenerPagosPendientes)


export default router;