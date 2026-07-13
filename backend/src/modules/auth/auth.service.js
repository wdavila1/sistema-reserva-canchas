import { ApiError } from "../../utils/ApiError.js";
import { hashPassword, compararPassword } from "../../utils/bcrypt.js";
import { firmarAccessToken, firmarRefreshToken, verificarRefreshToken } from "../../utils/jwt.js";
import * as authRepository from "./auth.repository.js";

// ─── Regex de validación de campos ───────────────────────────────────────────
const REGEX_CONTRASENA   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~])/;
const REGEX_CORREO       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_NOMBRE       = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$/;  // letras, tildes, espacios, apóstrofe, guion
const REGEX_USUARIO      = /^[a-zA-Z0-9_\-]{3,50}$/;           // alfanumérico + _ y -, entre 3 y 50 chars
const REGEX_TELEFONO     = /^\+?[\d\s\-]{8,15}$/;              // 8-15 dígitos, permite +, espacios y guiones
const REGEX_IDENTIDAD_HN = /^\d{13}$/;                          // exactamente 13 dígitos, sin guiones ni espacios
const REGEX_RTN_HN       = /^\d{14}$/;                          // exactamente 14 dígitos, sin guiones ni espacios
const MIN_LARGO_CONTRASENA = 12;

export function validarContrasena(contrasena) {
  if (!contrasena || contrasena.length < MIN_LARGO_CONTRASENA) {
    return `La contraseña debe tener al menos ${MIN_LARGO_CONTRASENA} caracteres.`;
  }
  if (!REGEX_CONTRASENA.test(contrasena)) {
    return "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos especiales (!@#$%...).";
  }
  return null; // null = válida
}

function mapUsuarioPublico(row) {
  return {
    id: row.usuarioid,
    nombre: `${row.primernombre} ${row.primerapellido}`.trim(),
    email: row.correo,
    telefono: row.telefono,
    rol: row.nombrerol === "Administrador" ? "admin" : "cliente",
    fechaRegistro: row.fechacreacion,
    // TODO: calcular con un COUNT real contra Reservas cuando exista modules/reservas.
    totalReservas: 0,
  };
}

function generarTokens(row) {
  const payload = { usuarioId: row.usuarioid, rolId: row.rolid, nombreRol: row.nombrerol };
  return {
    accessToken: firmarAccessToken(payload),
    refreshToken: firmarRefreshToken(payload),
  };
}

export async function registrar({
  primerNombre, segundoNombre, primerApellido, segundoApellido,
  correo, telefono, nombreUsuario, contrasena,
  numeroIdentidad, rtn, direccion,
}) {
  // ── 1. Normalizar — trim en todos los strings ─────────────────────────────
  primerNombre    = (primerNombre    ?? "").trim();
  segundoNombre   = (segundoNombre   ?? "").trim() || null;
  primerApellido  = (primerApellido  ?? "").trim();
  segundoApellido = (segundoApellido ?? "").trim() || null;
  correo          = (correo          ?? "").trim().toLowerCase();
  telefono        = (telefono        ?? "").trim();
  nombreUsuario   = (nombreUsuario   ?? "").trim();
  numeroIdentidad = (numeroIdentidad ?? "").trim() || null;
  rtn             = (rtn             ?? "").trim() || null;
  direccion       = (direccion       ?? "").trim() || null;

  // ── 2. Campos obligatorios ────────────────────────────────────────────────
  if (!primerNombre || !primerApellido || !correo || !telefono || !nombreUsuario || !contrasena) {
    throw new ApiError(400, "Faltan campos obligatorios para el registro.");
  }

  // ── 3. Formato de nombres/apellidos (solo letras y tildes) ────────────────
  if (!REGEX_NOMBRE.test(primerNombre))
    throw new ApiError(400, "El primer nombre solo puede contener letras y espacios.");
  if (!REGEX_NOMBRE.test(primerApellido))
    throw new ApiError(400, "El primer apellido solo puede contener letras y espacios.");
  if (segundoNombre && !REGEX_NOMBRE.test(segundoNombre))
    throw new ApiError(400, "El segundo nombre solo puede contener letras y espacios.");
  if (segundoApellido && !REGEX_NOMBRE.test(segundoApellido))
    throw new ApiError(400, "El segundo apellido solo puede contener letras y espacios.");

  // ── 4. Formato de correo ──────────────────────────────────────────────────
  if (!REGEX_CORREO.test(correo))
    throw new ApiError(400, "El formato del correo electrónico no es válido.");

  // ── 5. Formato de nombre de usuario ──────────────────────────────────────
  if (!REGEX_USUARIO.test(nombreUsuario))
    throw new ApiError(400, "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos (mínimo 3 caracteres, sin espacios).");

  // ── 6. Formato de teléfono ────────────────────────────────────────────────
  if (!REGEX_TELEFONO.test(telefono))
    throw new ApiError(400, "El teléfono no tiene un formato válido (mínimo 8 dígitos).");

  // ── 7. Contraseña ─────────────────────────────────────────────────────────
  const errorContrasena = validarContrasena(contrasena);
  if (errorContrasena) throw new ApiError(400, errorContrasena);

  // ── 8. Formato de identidad hondureña (13 dígitos exactos) ───────────────
  if (numeroIdentidad && !REGEX_IDENTIDAD_HN.test(numeroIdentidad))
    throw new ApiError(400, "El número de identidad debe ser exactamente 13 dígitos (sin guiones ni espacios).");

  // ── 9. Formato de RTN hondureño (14 dígitos exactos) ─────────────────────
  if (rtn && !REGEX_RTN_HN.test(rtn))
    throw new ApiError(400, "El RTN debe ser exactamente 14 dígitos (sin guiones ni espacios).");

  // ── 10. Unicidad de correo y nombre de usuario ────────────────────────────
  const yaExiste = await authRepository.existeCorreoOUsuario(correo, nombreUsuario);
  if (yaExiste) throw new ApiError(409, "Ya existe una cuenta con ese correo o nombre de usuario.");

  // ── 11. Unicidad de identidad y RTN ──────────────────────────────────────
  if (numeroIdentidad || rtn) {
    const duplicados = await authRepository.existeIdentidadORtn(numeroIdentidad, rtn);
    if (duplicados.identidad)
      throw new ApiError(409, "El número de identidad ingresado ya está registrado en el sistema.");
    if (duplicados.rtn)
      throw new ApiError(409, "El RTN ingresado ya está registrado en el sistema.");
  }

  const rolId = await authRepository.obtenerRolIdPorNombre("Cliente");
  const contrasenaHash = await hashPassword(contrasena);

  await authRepository.crearPersonaYUsuario({
    primerNombre, segundoNombre, primerApellido, segundoApellido,
    correo, telefono, nombreUsuario, contrasenaHash, rolId,
    numeroIdentidad,
    rtn,
    direccion,
  });

  // Reutilizamos el login para no duplicar la lógica de generación de tokens.
  return login({ identificador: nombreUsuario, contrasena });
}

export async function login({ identificador, contrasena }) {
  if (!identificador || !contrasena) {
    throw new ApiError(400, "Debes enviar tu usuario/correo y contraseña.");
  }

  const usuarioRow = await authRepository.buscarUsuarioParaLogin(identificador);
  if (!usuarioRow) {
    throw new ApiError(401, "Credenciales incorrectas.");
  }
  if (!usuarioRow.estadousuario) {
    throw new ApiError(403, "Este usuario está inactivo. Contacta a un administrador.");
  }

  const passwordOk = await compararPassword(contrasena, usuarioRow.contrasena);
  if (!passwordOk) {
    throw new ApiError(401, "Credenciales incorrectas.");
  }

  const { accessToken, refreshToken } = generarTokens(usuarioRow);
  return { usuario: mapUsuarioPublico(usuarioRow), accessToken, refreshToken };
}

export async function refrescarToken(refreshToken) {
  if (!refreshToken) throw new ApiError(401, "No se envió el refresh token.");

  let payload;
  try {
    payload = verificarRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, "Refresh token inválido o expirado. Inicia sesión de nuevo.");
  }

  const usuarioRow = await authRepository.buscarUsuarioPorId(payload.usuarioId);
  if (!usuarioRow || !usuarioRow.nombrerol) {
    throw new ApiError(401, "El usuario ya no existe.");
  }

  const nuevoPayload = { usuarioId: usuarioRow.usuarioid, rolId: usuarioRow.rolid, nombreRol: usuarioRow.nombrerol };
  const accessToken = firmarAccessToken(nuevoPayload);
  return { usuario: mapUsuarioPublico(usuarioRow), accessToken };
}

export async function obtenerPerfil(usuarioId) {
  const usuarioRow = await authRepository.buscarUsuarioPorId(usuarioId);
  if (!usuarioRow) throw new ApiError(404, "Usuario no encontrado.");
  return mapUsuarioPublico(usuarioRow);
}
