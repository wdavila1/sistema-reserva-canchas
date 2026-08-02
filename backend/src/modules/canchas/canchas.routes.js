import {Router} from "express";
import multer from "multer";
import * as CanchasController from "./canchas.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import {requiereRol} from "../../middlewares/roles.middleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
});

const router = Router();

router.get("/", CanchasController.getCanchas);
router.get("/:id", CanchasController.getCanchaById);
router.get("/:id/disponibilidad", CanchasController.getDisponibilidad);
router.get("/:id/disponibilidad/semanal", CanchasController.getDisponibilidadSemanal);

const soloAdmin = [verificarToken, requiereRol(["Administrador"])];

router.post("/", soloAdmin, CanchasController.createCancha);
router.put("/:id", soloAdmin, CanchasController.updateCancha);
router.patch("/:id/estado", soloAdmin, CanchasController.updateCanchaStatus);
router.patch("/:id/imagen", soloAdmin, upload.single("imagen"), CanchasController.uploadImagen);
router.delete("/:id/imagen", soloAdmin, CanchasController.deleteImagen);
router.delete("/:id", soloAdmin, CanchasController.deleteCancha);

export default router;