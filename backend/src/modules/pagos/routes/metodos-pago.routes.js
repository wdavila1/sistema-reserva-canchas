import { Router } from "express";
import * as metodosPagoController from "../controller/metodos-pago.controller.js"

const router = Router();

router.get("/obtener/todos",metodosPagoController.obtenerMetodosPago);

export default router;