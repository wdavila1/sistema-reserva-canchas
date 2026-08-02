// Lógica de negocio del perfil propio del usuario autenticado.
// Separado del módulo "usuarios" (que es exclusivo del Administrador).

import * as PerfilRepository from "./perfil.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { hashPassword, compararPassword } from "../../utils/bcrypt.js";
import { env } from "../../config/env.js";
import { createClient } from "@supabase/supabase-js";

// ── Regexes (mismas que auth.service.js y usuarios.service.js) ────────────────
const REGEX_CORREO       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO     = /^\+?[\d\s\-]{8,15}$/;
const REGEX_IDENTIDAD_HN = /^\d{13}$/;
const REGEX_RTN_HN       = /^\d{14}$/;
const REGEX_NOMBRE       = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'\-]+$/;
const MIN_LARGO_CONTRASENA = 12;
const REGEX_CONTRASENA   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>?/\\|`~])/;

const MIME_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/* GET - Perfil propio */
export async function obtenerMiPerfil(usuarioId) {
  const perfil = await PerfilRepository.obtenerPerfilPorUsuarioId(usuarioId);
  if (!perfil) throw new ApiError(404, "Usuario no encontrado.");
  return perfil;
}

/* PUT - Actualizar datos personales (no cambia contraseña ni rol ni nombre de usuario) */
export async function actualizarMiPerfil(usuarioId, datos) {
  const perfil = await obtenerMiPerfil(usuarioId); // lanza 404 si no existe

  const {
    primerNombre, segundoNombre, primerApellido, segundoApellido,
    numeroIdentidad, rtn, correo, telefono, direccion,
  } = datos;

  // ── Validaciones ──────────────────────────────────────────────────────────
  if (!primerNombre || !primerApellido || !correo || !telefono) {
    throw new ApiError(400, "Faltan campos obligatorios (nombre, apellido, correo, teléfono).");
  }
  if (!REGEX_NOMBRE.test(primerNombre))
    throw new ApiError(400, "El primer nombre solo puede contener letras y espacios.");
  if (!REGEX_NOMBRE.test(primerApellido))
    throw new ApiError(400, "El primer apellido solo puede contener letras y espacios.");
  if (segundoNombre && !REGEX_NOMBRE.test(segundoNombre))
    throw new ApiError(400, "El segundo nombre solo puede contener letras y espacios.");
  if (segundoApellido && !REGEX_NOMBRE.test(segundoApellido))
    throw new ApiError(400, "El segundo apellido solo puede contener letras y espacios.");
  if (!REGEX_CORREO.test(correo))
    throw new ApiError(400, "El formato del correo electrónico no es válido.");
  if (!REGEX_TELEFONO.test(telefono))
    throw new ApiError(400, "El teléfono no tiene un formato válido (mínimo 8 dígitos).");
  if (numeroIdentidad && !REGEX_IDENTIDAD_HN.test(numeroIdentidad))
    throw new ApiError(400, "El número de identidad debe ser exactamente 13 dígitos.");
  if (rtn && !REGEX_RTN_HN.test(rtn))
    throw new ApiError(400, "El RTN debe ser exactamente 14 dígitos.");

  // ── Unicidad ──────────────────────────────────────────────────────────────
  if (await PerfilRepository.correoEnUso(correo, perfil.PersonaID)) {
    throw new ApiError(409, "Ese correo electrónico ya está en uso por otra cuenta.");
  }
  if (await PerfilRepository.identidadORtnEnUso(numeroIdentidad, rtn, perfil.PersonaID)) {
    throw new ApiError(409, "El número de identidad o RTN ya está en uso por otra persona.");
  }

  await PerfilRepository.actualizarDatosPersona(perfil.PersonaID, {
    primerNombre, segundoNombre, primerApellido, segundoApellido,
    numeroIdentidad, rtn, correo, telefono, direccion,
  });

  return await obtenerMiPerfil(usuarioId);
}

/* PATCH - Cambiar contraseña propia (requiere contraseña actual) */
export async function cambiarContrasena(usuarioId, { contrasenaActual, contrasenaNueva, confirmarContrasena }) {
  if (!contrasenaActual || !contrasenaNueva || !confirmarContrasena) {
    throw new ApiError(400, "Debes enviar la contraseña actual, la nueva y su confirmación.");
  }
  if (contrasenaNueva !== confirmarContrasena) {
    throw new ApiError(400, "La nueva contraseña y su confirmación no coinciden.");
  }
  if (contrasenaNueva.length < MIN_LARGO_CONTRASENA) {
    throw new ApiError(400, `La nueva contraseña debe tener al menos ${MIN_LARGO_CONTRASENA} caracteres.`);
  }
  if (!REGEX_CONTRASENA.test(contrasenaNueva)) {
    throw new ApiError(400, "La contraseña debe incluir mayúsculas, minúsculas, números y símbolos especiales.");
  }

  const hashActual = await PerfilRepository.obtenerHashContrasena(usuarioId);
  if (!hashActual) throw new ApiError(404, "Usuario no encontrado.");

  const coincide = await compararPassword(contrasenaActual, hashActual);
  if (!coincide) throw new ApiError(401, "La contraseña actual es incorrecta.");

  if (await compararPassword(contrasenaNueva, hashActual)) {
    throw new ApiError(400, "La nueva contraseña no puede ser igual a la actual.");
  }

  const nuevoHash = await hashPassword(contrasenaNueva);
  await PerfilRepository.actualizarContrasena(usuarioId, nuevoHash);

  return { mensaje: "Contraseña actualizada correctamente." };
}

/* PATCH - Subir foto de perfil a Supabase Storage y guardar URL */
export async function subirFotoPerfil(usuarioId, archivo) {
  if (!archivo) throw new ApiError(400, "No se recibió ningún archivo.");
  if (!MIME_PERMITIDOS.includes(archivo.mimetype)) {
    throw new ApiError(400, "Solo se permiten imágenes en formato JPG, PNG, WebP o GIF.");
  }
  if (archivo.size > MAX_BYTES) {
    throw new ApiError(400, "La imagen no debe superar los 2 MB.");
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApiError(500, "El servidor no está configurado para subir archivos.");
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const ext  = archivo.originalname.split(".").pop();
  const path = `usuarios/${usuarioId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("perfiles")
    .upload(path, archivo.buffer, {
      contentType: archivo.mimetype,
      upsert: true,       // sobreescribe si ya existe
    });

  if (uploadError) {
    throw new ApiError(500, `Error al subir la imagen: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("perfiles").getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`; // Forzar recarga ignorando caché

  const perfil = await obtenerMiPerfil(usuarioId);
  await PerfilRepository.actualizarFotoPerfilURL(perfil.PersonaID, url);

  return { fotoPerfilURL: url };
}

/* DELETE - Eliminar foto de perfil */
export async function eliminarFotoPerfil(usuarioId) {
  const perfil = await obtenerMiPerfil(usuarioId);
  if (!perfil.FotoPerfilURL) {
    throw new ApiError(400, "No tienes una foto de perfil para eliminar.");
  }

  // Extraer el path del archivo desde la URL para borrarlo en Supabase
  // Ej URL: https://.../storage/v1/object/public/perfiles/usuarios/1/avatar.png
  // El path interno es lo que sigue después del nombre del bucket ("perfiles/")
  try {
    const urlObj = new URL(perfil.FotoPerfilURL);
    const pathIndex = urlObj.pathname.indexOf("/perfiles/");
    if (pathIndex !== -1 && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      const filePath = urlObj.pathname.substring(pathIndex + "/perfiles/".length);
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.storage.from("perfiles").remove([filePath]);
    }
  } catch (err) {
    // Si falla el borrado en Supabase (ej. el archivo ya no existe), no bloqueamos la actualización en BD
    console.warn("Error al intentar borrar el archivo de Supabase Storage:", err);
  }

  await PerfilRepository.actualizarFotoPerfilURL(perfil.PersonaID, null);
  return { mensaje: "Foto de perfil eliminada." };
}
