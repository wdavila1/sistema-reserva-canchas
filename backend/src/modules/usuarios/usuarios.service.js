import * as UsuariosRepository from "./usuarios.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/bcrypt.js";
import { generarPasswordTemporal } from "../../utils/generarPassword.js";

const REGEX_CORREO       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO     = /^\+?[\d\s\-]{8,15}$/;
const REGEX_IDENTIDAD_HN = /^\d{13}$/;
const REGEX_RTN_HN       = /^\d{14}$/;
const REGEX_NOMBRE       = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$/;
const REGEX_USUARIO      = /^[a-zA-Z0-9_\-]{3,50}$/;

function validarCamposPersonales(datos) {
  const { correo, telefono, numeroIdentidad, rtn, primerNombre, segundoNombre, primerApellido, segundoApellido, nombreUsuario } = datos;
  
  if (correo && !REGEX_CORREO.test(correo)) {
    throw new ApiError(400, "El formato del correo electrónico no es válido.");
  }
  if (telefono && !REGEX_TELEFONO.test(telefono)) {
    throw new ApiError(400, "El teléfono no tiene un formato válido (mínimo 8 dígitos).");
  }
  if (numeroIdentidad && !REGEX_IDENTIDAD_HN.test(numeroIdentidad)) {
    throw new ApiError(400, "El número de identidad debe ser exactamente 13 dígitos (sin guiones ni espacios).");
  }
  if (rtn && !REGEX_RTN_HN.test(rtn)) {
    throw new ApiError(400, "El RTN debe ser exactamente 14 dígitos (sin guiones ni espacios).");
  }
  if (primerNombre && !REGEX_NOMBRE.test(primerNombre)) {
    throw new ApiError(400, "El primer nombre solo puede contener letras y espacios.");
  }
  if (primerApellido && !REGEX_NOMBRE.test(primerApellido)) {
    throw new ApiError(400, "El primer apellido solo puede contener letras y espacios.");
  }
  if (segundoNombre && !REGEX_NOMBRE.test(segundoNombre)) {
    throw new ApiError(400, "El segundo nombre solo puede contener letras y espacios.");
  }
  if (segundoApellido && !REGEX_NOMBRE.test(segundoApellido)) {
    throw new ApiError(400, "El segundo apellido solo puede contener letras y espacios.");
  }
  if (nombreUsuario && !REGEX_USUARIO.test(nombreUsuario)) {
    throw new ApiError(400, "El nombre de usuario solo permite letras, números, guiones y guiones bajos (mín. 3 caracteres, sin espacios).");
  }
}

/* GET - Lista paginada de usuarios */
export async function obtenerUsuarios({ page = 1, limit = 10, rolId, busqueda }) {
  const offset = (page - 1) * limit;

  const result = await UsuariosRepository.obtenerUsuarios({
    limit,
    offset,
    rolId: rolId || null,
    busqueda: busqueda || null,
  });

  const totalItems = result.length > 0 ? result[0].TotalRegistros : 0;
  const data = result.map(({ TotalRegistros, ...usuario }) => usuario);
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  const pagination = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { data, pagination };
}

/* GET - Catálogo de roles */
export async function obtenerRoles() {
  return await UsuariosRepository.obtenerRoles();
}

/* GET - Un usuario por su ID */
export async function obtenerUsuarioPorId(id) {
  const usuario = await UsuariosRepository.obtenerUsuarioPorId(id);
  if (!usuario) {
    throw new ApiError(404, "Usuario no encontrado.");
  }
  return usuario;
}

/* POST - Crear un usuario nuevo (el admin elige el rol) */
export async function crearUsuario(datos) {
  const {
    primerNombre, segundoNombre, primerApellido, segundoApellido,
    numeroIdentidad, rtn, correo, telefono, direccion,
    nombreUsuario, rolId,
  } = datos;

  if (!primerNombre || !primerApellido || !correo || !telefono || !nombreUsuario || !rolId) {
    throw new ApiError(400, "Faltan campos obligatorios para crear el usuario.");
  }

  validarCamposPersonales(datos);

  const rolExiste = await UsuariosRepository.existeRolId(rolId);
  if (!rolExiste) {
    throw new ApiError(400, "El rol seleccionado no existe.");
  }

  const yaExisteCorreoOUsuario = await UsuariosRepository.existeCorreoOUsuario(correo, nombreUsuario);
  if (yaExisteCorreoOUsuario) {
    throw new ApiError(409, "Ya existe un usuario con ese correo o nombre de usuario.");
  }

  const yaExisteIdentidad = await UsuariosRepository.existeIdentidadORtn(numeroIdentidad, rtn);
  if (yaExisteIdentidad) {
    throw new ApiError(409, "Ya existe una persona con ese número de identidad o RTN.");
  }

  const passwordTemporal = generarPasswordTemporal();
  const contrasenaHash = await hashPassword(passwordTemporal);

  const nuevoUsuarioId = await UsuariosRepository.crearPersonaYUsuario({
    primerNombre, segundoNombre, primerApellido, segundoApellido,
    numeroIdentidad, rtn, correo, telefono, direccion,
    nombreUsuario, contrasenaHash, rolId,
  });

  const usuario = await obtenerUsuarioPorId(nuevoUsuarioId);
  return { usuario, passwordTemporal };
}

/* PUT - Actualizar un usuario existente */
export async function actualizarUsuario(id, datos) {
  await obtenerUsuarioPorId(id); // lanza 404 si no existe

  const { correo, nombreUsuario, numeroIdentidad, rtn, rolId } = datos;

  validarCamposPersonales(datos);

  const yaExisteCorreoOUsuario = await UsuariosRepository.existeCorreoOUsuario(correo, nombreUsuario, id);
  if (yaExisteCorreoOUsuario) {
    throw new ApiError(409, "Ya existe otro usuario con ese correo o nombre de usuario.");
  }

  const yaExisteIdentidad = await UsuariosRepository.existeIdentidadORtn(numeroIdentidad, rtn, id);
  if (yaExisteIdentidad) {
    throw new ApiError(409, "Ya existe otra persona con ese número de identidad o RTN.");
  }

  if (rolId) {
    const rolExiste = await UsuariosRepository.existeRolId(rolId);
    if (!rolExiste) {
      throw new ApiError(400, "El rol seleccionado no existe.");
    }
  }

  await UsuariosRepository.actualizarUsuario(id, datos);
  return await obtenerUsuarioPorId(id);
}

/* PATCH - Activar/desactivar (borrado seguro) */
export async function actualizarEstado(id, nuevoEstado, usuarioActualId) {
  await obtenerUsuarioPorId(id);

  if (typeof nuevoEstado !== "boolean") {
    throw new ApiError(400, "El estado debe ser true o false.");
  }
  if (Number(id) === Number(usuarioActualId) && nuevoEstado === false) {
    throw new ApiError(400, "No puedes desactivar tu propia cuenta.");
  }

  await UsuariosRepository.actualizarEstadoUsuario(id, nuevoEstado);
  return await obtenerUsuarioPorId(id);
}

/* PATCH - Resetear contraseña (genera una temporal nueva) */
export async function resetearContrasena(id) {
  await obtenerUsuarioPorId(id);

  const passwordTemporal = generarPasswordTemporal();
  const contrasenaHash = await hashPassword(passwordTemporal);
  await UsuariosRepository.actualizarContrasena(id, contrasenaHash);

  return { passwordTemporal };
}

/* DELETE - Eliminar físicamente (solo si no tiene historial asociado) */
export async function eliminarUsuario(id, usuarioActualId) {
  await obtenerUsuarioPorId(id);

  if (Number(id) === Number(usuarioActualId)) {
    throw new ApiError(400, "No puedes eliminar tu propia cuenta.");
  }

  const tieneHistorial = await UsuariosRepository.tieneHistorialAsociado(id);
  if (tieneHistorial) {
    throw new ApiError(
      409,
      "No se puede eliminar: el usuario tiene reservas o facturas asociadas. Te sugerimos desactivarlo en vez de eliminarlo."
    );
  }

  await UsuariosRepository.eliminarUsuario(id);
  return { mensaje: "Usuario eliminado exitosamente" };
}