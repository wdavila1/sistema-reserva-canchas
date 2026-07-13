import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Cliente de Supabase usado ÚNICAMENTE para Storage (subida/descarga de archivos).
// El backend NO usa este cliente para leer/escribir tablas (eso se hace con SQL vía config/db.js).
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
