import { app } from "./src/app.js";
import { env } from "./src/config/env.js";
import cron from "node-cron";
import { generarRecordatorios } from "./src/modules/notificaciones/notificaciones.service.js";

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend escuchando en http://localhost:${env.PORT}`);
});

cron.schedule("*/30 * * * *", async () => {
  try {
    const creadas = await generarRecordatorios();
    console.log(`[cron] Notificaciones generadas: ${creadas}`);
  } catch (err) {
    console.error("[cron] Error generando notificaciones:", err.message);
  }
});