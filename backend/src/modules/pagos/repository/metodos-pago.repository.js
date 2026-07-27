
import { pool } from "../../../config/db.js"

export async function obtenerMetodosPago(){
    const query = `
        SELECT mp.metodopagoid AS metodoPagoId,
        mp.metodo AS metodopago
        from metodospago mp;
    `

    const { rows } = await pool.query(query);
    return rows;
}

export async function obtenerMetodoPagoPorId(idPago) {
    const query = `
        SELECT mp.metodopagoid AS metodoPagoId,
        mp.metodo AS metodopago
        from metodospago mp
        WHERE mp.metodopagoid = ${idPago};
    `
    const { rows } = await pool.query(query);

    return rows;
}