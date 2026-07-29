import { pool } from "../../config/db.js";
import * as facturaRepository from "./facturas.repository.js";
import * as pagoRepository from "../pagos/repository/pagos.repository.js";
import * as reservaRepository from "../reservas/reservas.repository.js";
import { ApiError } from "../../utils/ApiError.js";

const TASA_ISV = 0.15;

export async function generarFactura(datosFacturacion, usuarioEmiteId) {
    const { pagoId, rtn = null, razonSocialCliente = null } = datosFacturacion;

    //En este caso hice la conexion aca para evitar errores
    //en caso de que hayan errores de generar e insercion hace no se aprueban los datos
    const client = await pool.connect();

    await client.query("BEGIN");

    const pago = await pagoRepository.obtenerPagoParaFacturar(pagoId, client);

    if (!pago) {
        throw new ApiError(404, "Pago no encontrado");
    }
    if (pago.estadopago !== 'Aprobado') {
        throw new ApiError(400, "El pago no está aprobado");
    }
    if (pago.facturaid !== null) {
        throw new ApiError(400, "Este pago ya tiene factura generada");
    }

    const detalles = await reservaRepository.obtenerReservaPorId(pago.reservaid);
    if (!detalles.length) {
        throw new ApiError(400, "La reserva no tiene detalle de canchas");
    }

    const cai = await facturaRepository.verificarCAIActivo();
    if (!cai) {
        throw new ApiError(400, "No hay CAI activo vigente");
    }

    const numeroFactura = await facturaRepository.generarNumeroFactura(client, cai.caiid);

    const subTotal = detalles.reduce((acc, d) => acc + Number(d.subtotal), 0);
    const isv = Number((subTotal * TASA_ISV).toFixed(2));
    const total = Number((subTotal + isv).toFixed(2));

    const facturaId = await facturaRepository.crearFactura(client, {
        reservaId: pago.reservaid,
        caiId: cai.caiid,
        usuarioEmiteId,
        numeroFactura,
        subTotal,
        isv,
        total,
        rtnCliente: rtn,
        razonSocialCliente,
    });

    await pagoRepository.vincularFactura(client, pagoId, facturaId);

    await client.query("COMMIT");

    return { facturaId, numeroFactura, subTotal, isv, total };
}