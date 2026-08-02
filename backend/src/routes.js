import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import canchasRoutes from "./modules/canchas/canchas.routes.js";
import reservasRoutes from "./modules/reservas/reservas.routes.js";
import pagosRoutes from "./modules/pagos/routes/pagos.routes.js"
import reportesRoutes from "./modules/reportes/reportes.routes.js";
import metodosPagoRoutes from "./modules/pagos/routes/metodos-pago.routes.js"
import notificacionesRoutes from "./modules/notificaciones/notificaciones.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/auth", authRoutes);
router.use("/canchas", canchasRoutes);
router.use("/reservas", reservasRoutes);
router.use("/pagos", pagosRoutes);
router.use("/metodos-pago",metodosPagoRoutes);
router.use("/reportes", reportesRoutes);
router.use("/notificaciones", notificacionesRoutes);

// Los demás módulos (usuarios, facturas, pagos, reportes)
// se montan aquí cuando se implementen:
export default router;