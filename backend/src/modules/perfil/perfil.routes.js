// Rutas del perfil propio del usuario autenticado.
// Accesible para cualquier rol (Cliente y Administrador).

import { Router } from "express";
import multer from "multer";
import * as PerfilController from "./perfil.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// Multer en memoria: el buffer se pasa directamente a Supabase Storage.
// Límite de 2 MB (el service también lo valida a nivel de bytes).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Todas las rutas requieren JWT válido.
const protegido = [verificarToken];

router.get("/",               protegido, PerfilController.getMiPerfil);
router.put("/",               protegido, PerfilController.updateMiPerfil);
router.patch("/password",     protegido, PerfilController.changePassword);
router.patch("/foto",         protegido, upload.single("foto"), PerfilController.uploadFoto);
router.delete("/foto",        protegido, PerfilController.deleteFoto);

export default router;
