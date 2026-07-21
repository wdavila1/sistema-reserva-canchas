// Rutas: GET /api/reservas, POST /api/reservas, DELETE /api/reservas/:id (cancelar), GET /api/reservas/disponibilidad
import { Router } from "express";
import * as reservasController from "./reservas.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

// Todas las rutas de reservas requieren estar logueado.
router.use(verificarToken);

// Rutas propias de cualiquier usuario logueado).
router.get("/disponibilidad", reservasController.disponibilidad);
router.get("/mias", reservasController.misReservas);
router.post("/", reservasController.crear);
router.get("/:id", reservasController.obtenerPorId);
router.delete("/:id", reservasController.cancelar);

// Rutas exclusivas de admin.
router.get("/", requiereRol(["Administrador"]), reservasController.listarTodas);
router.patch("/:id/estado", requiereRol(["Administrador"]), reservasController.actualizarEstado);

export default router;