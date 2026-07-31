// Controladores del módulo de perfil propio (usuario autenticado).

import * as PerfilService from "./perfil.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// GET /api/perfil
export const getMiPerfil = asyncHandler(async (req, res) => {
  const perfil = await PerfilService.obtenerMiPerfil(req.user.usuarioId);
  res.status(200).json(perfil);
});

// PUT /api/perfil
export const updateMiPerfil = asyncHandler(async (req, res) => {
  const perfil = await PerfilService.actualizarMiPerfil(req.user.usuarioId, req.body);
  res.status(200).json(perfil);
});

// PATCH /api/perfil/password
export const changePassword = asyncHandler(async (req, res) => {
  const resultado = await PerfilService.cambiarContrasena(req.user.usuarioId, req.body);
  res.status(200).json(resultado);
});

// PATCH /api/perfil/foto
export const uploadFoto = asyncHandler(async (req, res) => {
  const resultado = await PerfilService.subirFotoPerfil(req.user.usuarioId, req.file);
  res.status(200).json(resultado);
});

// DELETE /api/perfil/foto
export const deleteFoto = asyncHandler(async (req, res) => {
  const resultado = await PerfilService.eliminarFotoPerfil(req.user.usuarioId);
  res.status(200).json(resultado);
});
