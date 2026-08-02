import * as CanchaService from './canchas.service.js';
import { asyncHandler } from "../../utils/asyncHandler.js";

//GET /api/canchas
export const getCanchas = asyncHandler(async (req, res) => {
    const filtros = {
        deporteId: req.query.deporteId,
        capacidadMinima: req.query.capacidadMinima,
        estado: req.query.estado,
    }
    const canchas = await CanchaService.obtenerCanchas(filtros);
    res.status(200).json(canchas);
});

// GET /api/canchas/:id
export const getCanchaById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const cancha = await CanchaService.obtenerCanchaPorId(id);
  
  res.status(200).json(cancha);
});

// POST /api/canchas
export const createCancha = asyncHandler(async (req, res) => {
  const datosCancha = req.body;
  
  const nuevaCancha = await CanchaService.crearCancha(datosCancha);
  

  res.status(201).json(nuevaCancha);
});

// PUT /api/canchas/:id
export const updateCancha = asyncHandler(async (req, res) => {
  const { id } = req.params;    
  const datosCancha = req.body;  
  const canchaActualizada = await CanchaService.actualizarCancha(id, datosCancha);
  
  res.status(200).json(canchaActualizada);
});

// PATCH /api/canchas/:id/estado
export const updateCanchaStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; 
  const canchaActualizada = await CanchaService.actualizarEstado(id, estado);
  
  res.status(200).json(canchaActualizada);
});

// GET /api/canchas/:id/disponibilidad?fecha=2026-07-18
export const getDisponibilidad = asyncHandler(async (req, res) => {
  const { id } = req.params;       
  const { fecha } = req.query;  
  const disponibilidad = await CanchaService.obtenerDisponibilidad(id, fecha);
  res.status(200).json(disponibilidad);
});

// GET /api/canchas/:id/disponibilidad?fechaInicio=2026-07-17&fechaFin=2026-07-23
export const getDisponibilidadSemanal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fechaInicio, fechaFin } = req.query;
  const resultado = await CanchaService.obtenerDisponibilidadSemana(id, fechaInicio, fechaFin);
  res.status(200).json(resultado);
});

// DELETE /api/canchas/:id
export const deleteCancha = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resultado = await CanchaService.eliminarCancha(id);
  res.status(200).json(resultado);
});

// PATCH /api/canchas/:id/imagen
export const uploadImagen = asyncHandler(async (req, res) => {
  const resultado = await CanchaService.subirImagenCancha(req.params.id, req.file);
  res.status(200).json(resultado);
});

// DELETE /api/canchas/:id/imagen
export const deleteImagen = asyncHandler(async (req, res) => {
  const resultado = await CanchaService.eliminarImagenCancha(req.params.id);
  res.status(200).json(resultado);
});