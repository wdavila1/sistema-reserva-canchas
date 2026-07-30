import { pool } from "../../config/db.js";

export async function verificarCAIActivo() {
  const query = `
    SELECT * 
    FROM CAIControl 
    WHERE Estado = TRUE AND CURRENT_DATE BETWEEN FechaInicio AND FechaFin
    LIMIT 1;
  `
  const { rows } = await pool.query(query);

  return rows[0];
}

export async function generarNumeroFactura(client, caiId) {
  const { rows } = await client.query(
    //el for update hace que se bloquee el caiid hasta que termine la transaccion -- por precaucion por el numero de factura
    `SELECT * FROM CAIControl WHERE CAIID = $1 FOR UPDATE`,
    [caiId]
  );
  const cai = rows[0];

  const nuevoCorrelativo = cai.ultimocorrelativo + 1;

  const [establecimiento, puntoEmision] = cai.rangoinicial.split('-');
  const numeroFactura = `${establecimiento}-${puntoEmision}-${String(nuevoCorrelativo).padStart(8, '0')}`;

  //verifica que no se pase del rango
  const partesFinal = cai.rangofinal.split('-');
  const correlativoFinal = partesFinal[partesFinal.length - 1]; // "00100000" formato de la tabla CAIControl

  if (nuevoCorrelativo > parseInt(correlativoFinal, 10)) {
    throw new Error('CAI agotado, se necesita uno nuevo');
  }

  await client.query(
    `UPDATE CAIControl SET UltimoCorrelativo = $1 WHERE CAIID = $2`,
    [nuevoCorrelativo, caiId]
  );

  return numeroFactura;
}

export async function crearFactura(client, datos) {
  const {
    reservaId, caiId, usuarioEmiteId, numeroFactura,
    subTotal, isv, exoneracion, total, rtnCliente, razonSocialCliente
  } = datos;

  const query = `
    INSERT INTO Facturas
      (ReservaID, CAIID, UsuarioEmiteID, NumeroFactura, SubTotal, ISV, Exoneracion, Total, RTNCliente, RazonSocialCliente)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING FacturaID;
  `
  const { rows } = await client.query(query, [
    reservaId, caiId, usuarioEmiteId, numeroFactura, subTotal, isv, exoneracion, total, rtnCliente, razonSocialCliente
  ]);
  return rows[0].facturaid;
}

export async function obtenerDetalleFactura(pagoId) {
  const query = `
    SELECT
    e.razonsocial AS razonsocial,
    e.rtn AS rtnempresa,
    e.direccion AS direccion,
    cc.caicode AS cai,
    CONCAT(cc.rangoinicial, cc.rangofinal) AS rangoautorizado,
    cc.fechafin AS fechafin,
    f.numerofactura AS numerofactura,
    f.fechaemision AS fechaemision,
    f.rtncliente AS rtncliente,
    c.nombrecancha AS servicioadquirido,
    f.subtotal AS subtotal,
    f.isv AS isv,
    f.exoneracion AS exoneracion,
    f.total AS total
    FROM empresa e
    JOIN caicontrol cc ON e.empresaid = cc.empresaid
    JOIN facturas f ON cc.caiid = f.caiid
    JOIN reservas r ON r.reservaid = f.reservaid
    JOIN detallereservas dr ON dr.reservaid = r.reservaid
    JOIN canchas c ON c.canchaid = dr.canchaid
    JOIN pagos p ON p.reservaid = r.reservaid
    WHERE p.pagoid = $1
  `

  const { rows } = await pool.query(query,[pagoId])

  return rows[0];
}