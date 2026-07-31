// Controladores del CRUD de usuarios/personas/roles.

import * as UsuariosService from "./usuarios.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// GET /api/usuarios?page=1&limit=10&rolId=2&busqueda=carlos
export const getUsuarios = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, rolId, busqueda } = req.query;
  page = Math.max(Number(page), 1);
  limit = Math.max(Number(limit), 1);
  rolId = rolId ? Number(rolId) : null;

  const resultado = await UsuariosService.obtenerUsuarios({ page, limit, rolId, busqueda });
  res.status(200).json(resultado);
});

// GET /api/usuarios/roles (catálogo para el <select> del formulario)
export const getRoles = asyncHandler(async (req, res) => {
  const roles = await UsuariosService.obtenerRoles();
  res.status(200).json(roles);
});

// GET /api/usuarios/:id
export const getUsuarioById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = await UsuariosService.obtenerUsuarioPorId(id);
  res.status(200).json(usuario);
});

// POST /api/usuarios
export const createUsuario = asyncHandler(async (req, res) => {
  const resultado = await UsuariosService.crearUsuario(req.body);
  res.status(201).json(resultado);
});

// PUT /api/usuarios/:id
export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const usuario = await UsuariosService.actualizarUsuario(id, req.body);
  res.status(200).json(usuario);
});

// PATCH /api/usuarios/:id/estado
export const updateUsuarioEstado = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const usuario = await UsuariosService.actualizarEstado(id, estado, req.user.usuarioId);
  res.status(200).json(usuario);
});

// PATCH /api/usuarios/:id/password
export const resetPasswordUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resultado = await UsuariosService.resetearContrasena(id);
  res.status(200).json(resultado);
});

// DELETE /api/usuarios/:id
export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resultado = await UsuariosService.eliminarUsuario(id, req.user.usuarioId);
  res.status(200).json(resultado);
});
