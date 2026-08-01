import { Router } from "express";
import * as expertoController from "./experto.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

// Todas las rutas del sistema experto requieren autenticación
router.use(verificarToken);

// Para el cliente
// Está es una sugernecia personalizada basada en el historial del usuario autenticado
router.get("/sugerencia-usuario", expertoController.sugerenciaUsuario);

// Para el admin
// Resumen de métricas para el dashboard (número de alertas, cancha top, etc.)
router.get("/resumen", requiereRol(["Administrador"]), expertoController.resumenExperto);

// Detalle de horarios pico (ocupación >= 70%)
router.get("/patrones-demanda", requiereRol(["Administrador"]), expertoController.patronesAltaDemanda);

// Sugerencias de promociones para horarios de baja ocupación (<= 30%)
router.get("/sugerencias-promociones", requiereRol(["Administrador"]), expertoController.sugerenciasPromociones);

export default router;
