// Rutas: GET/POST/PUT /api/usuarios (incluye Personas y Roles). Protegidas para Administrador.

import { Router } from "express";
import * as UsuariosController from "./usuarios.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";
import { requiereRol } from "../../middlewares/roles.middleware.js";

const router = Router();

// Todo el módulo de usuarios es exclusivo del Administrador.
const soloAdmin = [verificarToken, requiereRol(["Administrador"])];

// IMPORTANTE: "/roles" debe ir ANTES de "/:id" o Express lo confundiría con un id.
router.get("/roles", soloAdmin, UsuariosController.getRoles);
router.get("/", soloAdmin, UsuariosController.getUsuarios);
router.get("/:id", soloAdmin, UsuariosController.getUsuarioById);
router.post("/", soloAdmin, UsuariosController.createUsuario);
router.put("/:id", soloAdmin, UsuariosController.updateUsuario);
router.patch("/:id/estado", soloAdmin, UsuariosController.updateUsuarioEstado);
router.patch("/:id/password", soloAdmin, UsuariosController.resetPasswordUsuario);
router.delete("/:id", soloAdmin, UsuariosController.deleteUsuario);

export default router;