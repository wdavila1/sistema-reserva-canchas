import pg from "pg";
import { env } from "./env.js";

// Pool de conexión a PostgreSQL (Supabase, modo Session - puerto 5432).
// Ver README.md sección 4.1
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("[db] Error inesperado en el pool de Postgres:", err.message);
});

/** Helper corto para queries sueltas: const { rows } = await query('SELECT ...', [params]) */
export const query = (text, params) => pool.query(text, params);
