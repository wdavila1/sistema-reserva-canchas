import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/auth", authRoutes);

// Los demás módulos (usuarios, canchas, reservas, facturas, pagos, reportes)
// se montan aquí cuando se implementen:
// router.use("/canchas", canchasRoutes);
// router.use("/reservas", reservasRoutes);

export default router;
