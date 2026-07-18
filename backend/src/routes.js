import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import canchasRoutes from "./modules/canchas/canchas.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/auth", authRoutes);
router.use("/canchas", canchasRoutes);

// Los demás módulos (usuarios, reservas, facturas, pagos, reportes)
// se montan aquí cuando se implementen:
// router.use("/reservas", reservasRoutes);

export default router;
