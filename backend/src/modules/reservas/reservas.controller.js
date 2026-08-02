// Controladores de creación/cancelación/consulta de reservas y consulta de disponibilidad.
import * as reservasService from "./reservas.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const crear = asyncHandler(async (req, res) => {
  const { bloques } = req.body;
  const reserva = await reservasService.crearReserva(req.user.usuarioId, bloques);
  res.status(201).json({ reserva });
});
 
export const cancelar = asyncHandler(async(req,res) =>{
    const esAdmin = req.user.nombreRol === "Administrador";
    const reserva = await reservasService.cancelarReserva(Number(req.params.id), req.user.usuarioId, esAdmin);
    res.json({reserva})
});
 
export const misReservas = asyncHandler(async (req, res) => {
  const reservas = await reservasService.obtenerMisReservas(req.user.usuarioId);
  res.json({reservas});
});

export const obtenerPorId = asyncHandler (async (req, res) =>{
    const esAdmin = req.user.nombreRol === "Administrador";
    const reserva = await reservasService.obtenerReservaPorId(Number(req.params.id),req.user.usuarioId,esAdmin);
    res.json({reserva});
});

export const disponibilidad = asyncHandler(async (req, res) =>{
  const { canchaId, fecha } = req.query;
  const resultado = await reservasService.obtenerDisponibilidad(Number(canchaId), fecha);
  res.json(resultado);
});
 

// encargado de recibir las solicitudes para consultar las reservas desde el panel administrativo. Permite establecer la cantidad de registros por pagina, el numero de pagina y filtrar las reservas
//filra las reservas por estado
export const listarTodas = asyncHandler(async (req,res) => {
    let { limit = 5, page = 1, estado } = req.query;
    limit = Math.max(Number(limit), 1);
    page = Math.max(Number(page), 1);

    const response = await reservasService.obtenerTodasLasReservas(limit, page, estado);
    res.status(200).json(response);
});


export const actualizarEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const reserva = await reservasService.actualizarEstadoReserva(Number(req.params.id), estado);
  res.json({reserva});
});