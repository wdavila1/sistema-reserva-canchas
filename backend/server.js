import { app } from "./src/app.js";
import { env } from "./src/config/env.js";

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend escuchando en http://localhost:${env.PORT}`);
});
