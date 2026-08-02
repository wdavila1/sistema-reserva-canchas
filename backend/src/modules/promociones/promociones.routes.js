import { Router } from "express";
import * as promocionesController from "./promociones.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

// Ruta pública: ver promociones vigentes (para mostrar descuentos en el frontend al cliente)
router.get("/activas", promocionesController.obtenerPromocionesActivas);

// Rutas protegidas
router.use(verificarToken);

// Admins: CRUD completo de promociones
router.get("/", requiereRol(["Administrador"]), promocionesController.obtenerTodasLasPromociones);
router.get("/:id", requiereRol(["Administrador"]), promocionesController.obtenerPromocionPorId);
router.post("/", requiereRol(["Administrador"]), promocionesController.crearPromocion);
router.put("/:id", requiereRol(["Administrador"]), promocionesController.actualizarPromocion);
router.delete("/:id", requiereRol(["Administrador"]), promocionesController.eliminarPromocion);

export default router;
