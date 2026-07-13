import { Router } from "express";
import * as authController from "./auth.controller.js";
import { verificarToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/registro", authController.registrar);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", verificarToken, authController.me);

export default router;
