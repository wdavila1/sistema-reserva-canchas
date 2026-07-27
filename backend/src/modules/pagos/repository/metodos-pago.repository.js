
import { pool } from "../../../config/db.js"

export async function obtenerMetodosPago(){
    const query = `
        SELECT mp.metodopagoid AS metodoPagoId,
        mp.metodo AS metodo
        from metodospago mp;
    `

    const { rows } = await pool.query(query);
    return rows;
}