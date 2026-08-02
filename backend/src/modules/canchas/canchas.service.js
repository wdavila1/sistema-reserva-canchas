import * as CanchaRepository from './canchas.repository.js';
import {ApiError} from "../../utils/ApiError.js";
import { env } from "../../config/env.js";
import { createClient } from "@supabase/supabase-js";

const MIME_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB para fotos de canchas


const HORARIO_OPERACION = [
  "07:00","08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
  "19:00","20:00","21:00", "22:00",
];

/*GET - Obtener todas las canchas mediante un arreglo rows*/ 
export async function obtenerCanchas(filtros) {
    return await CanchaRepository.obtenerCanchas(filtros);
}

/*GET - Obtener una cancha por su ID*/
export async function obtenerCanchaPorId(id) {
    const cancha = await CanchaRepository.obtenerCanchaPorId(id);
    if (!cancha) {
        throw new ApiError(404, "Cancha no encontrada");
    }
    return cancha;
}

/*POST - Crear una nueva cancha*/
export async function crearCancha(datosCancha) {
    const { tipoCanchaId, nombreCancha, capacidad, precioPorHora } = datosCancha;
    // Validación básica de campos obligatorios
    if (!tipoCanchaId || !nombreCancha || !capacidad || precioPorHora === undefined) {
        throw new ApiError(400, "Faltan campos obligatorios para crear la cancha.");
    }

    // Reglas de negocio
    const yaExiste = await CanchaRepository.existeNombreCancha(nombreCancha);
    if (yaExiste) {
        throw new ApiError(409, `Ya existe una cancha con el nombre "${nombreCancha}".`);
    }
    if (capacidad <= 0) throw new ApiError(400, "La capacidad debe ser mayor a 0.");
    if (precioPorHora < 0) throw new ApiError(400, "El precio por hora no puede ser negativo.");

    const nuevaCanchaId = await CanchaRepository.crearCancha(datosCancha);
    
    return await obtenerCanchaPorId(nuevaCanchaId);
}

/*PUT - Actualizar información de una cancha*/
export async function actualizarCancha(id, datosCancha) {
    await obtenerCanchaPorId(id);

    if (datosCancha.nombreCancha) {
        const yaExiste = await CanchaRepository.existeNombreCancha(datosCancha.nombreCancha, id);
        if (yaExiste) {
        throw new ApiError(409, `El nombre "${datosCancha.nombreCancha}" ya está ocupado por otra cancha.`);
        }
    }

    await CanchaRepository.actualizarCancha(id, datosCancha);
    
    return await obtenerCanchaPorId(id);
}

/*PATCH - Actualizar estado de una cancha*/
export async function actualizarEstado(id, nuevoEstado) {
    await obtenerCanchaPorId(id);
    const estadosValidos = ['Disponible', 'Ocupada', 'Mantenimiento'];
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new ApiError(400, "El estado proporcionado no es válido.");
    }
    await CanchaRepository.actualizarEstadoCancha(id, nuevoEstado);
    return await obtenerCanchaPorId(id);
}

/* GET- DISPONIBILIDAD DE UNA CANCHA EN UNA FECHA */
export async function obtenerDisponibilidad(canchaId, fecha) {
  const cancha = await obtenerCanchaPorId(canchaId);
  if (!fecha) {
    throw new ApiError(400, "Debes enviar una fecha para consultar disponibilidad.");
  }

  if (cancha.Estado !== 'Disponible') {
    return { canchaId, fecha, horasDisponibles: [] };
  }

  const ocupadas = await CanchaRepository.obtenerHorasOcupadas(canchaId, fecha);

  const disponibles = HORARIO_OPERACION.filter((hora) => {
    return !ocupadas.some((o) => {
      const hIni = o.horainicio.slice(0, 5);
      const hFin = o.horafin.slice(0, 5);
      return hora >= hIni && hora < hFin;
    });
  });
  return { canchaId, fecha, horasDisponibles: disponibles };
}

/*GET - Disponibilidad pero de la semana*/ 
export async function obtenerDisponibilidadSemana(canchaId, fechaInicio, fechaFin) {
  const cancha = await obtenerCanchaPorId(canchaId); 
  if (!fechaInicio || !fechaFin) {
    throw new ApiError(400, "Debes enviar fechaInicio y fechaFin.");
  }

  if (cancha.Estado !== 'Disponible') {
    return { canchaId, disponibilidad: {} };
  }
  
  const ocupadas = await CanchaRepository.obtenerHorasOcupadasRango(canchaId, fechaInicio, fechaFin);
  const disponibilidad = {};

  const parsearFechaLocal = (fechaStr) => {
    const [y, m, d] = fechaStr.split('-');
    return new Date(y, m - 1, d);
  };

  let fechaActual = parsearFechaLocal(fechaInicio);

  const fechaLimite = parsearFechaLocal(fechaFin);

  while (fechaActual <= fechaLimite) {

    const yyyy = fechaActual.getFullYear();
    const mm = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaActual.getDate()).padStart(2, '0');
    const fechaString = `${yyyy}-${mm}-${dd}`;

    const ocupadasDelDia = ocupadas.filter(
      o => new Date(o.fecha).toISOString().split('T')[0] === fechaString
    );

    disponibilidad[fechaString] = HORARIO_OPERACION.filter((hora) => {
      return !ocupadasDelDia.some((o) => {
        const hIni = o.horainicio.slice(0, 5);
        const hFin = o.horafin.slice(0, 5);
        return hora >= hIni && hora < hFin;
      });
    });

    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return { canchaId, disponibilidad };
}

/*DELETE - Eliminar físicamente una cancha*/
export async function eliminarCancha(id) {
    await obtenerCanchaPorId(id);
    const tieneHistorial = await CanchaRepository.tieneReservas(id);
    
    if (tieneHistorial) {
        throw new ApiError(409, "No se puede eliminar la cancha porque tiene reservaciones asociadas. Te sugerimos cambiar su estado a Mantenimiento.");
    }
    
    await CanchaRepository.eliminarCancha(id);
    return { mensaje: "Cancha eliminada exitosamente" };
}

/* PATCH - Subir foto de cancha a Supabase Storage y guardar URL en la BD */
export async function subirImagenCancha(canchaId, archivo) {
    await obtenerCanchaPorId(canchaId); // Valida que la cancha exista

    if (!archivo) throw new ApiError(400, "No se recibió ningún archivo.");
    if (!MIME_PERMITIDOS.includes(archivo.mimetype)) {
        throw new ApiError(400, "Solo se permiten imágenes en formato JPG, PNG, WebP o GIF.");
    }
    if (archivo.size > MAX_BYTES) {
        throw new ApiError(400, "La imagen de la cancha no debe superar los 5 MB.");
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new ApiError(500, "El servidor no está configurado para subir archivos (falta Supabase).");
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const ext  = archivo.originalname.split(".").pop();
    const path = `canchas/${canchaId}/foto.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from("canchas")
        .upload(path, archivo.buffer, {
            contentType: archivo.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new ApiError(500, `Error al subir la imagen: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("canchas").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`; // Forzar recarga ignorando caché

    await CanchaRepository.actualizarCancha(canchaId, { imagenUrl: url });

    return { imagenUrl: url, mensaje: "Imagen de cancha actualizada exitosamente." };
}

/* DELETE - Eliminar foto de la cancha de Supabase y limpiar BD */
export async function eliminarImagenCancha(canchaId) {
    const cancha = await obtenerCanchaPorId(canchaId);
    if (!cancha.ImagenURL) {
        throw new ApiError(400, "Esta cancha no tiene una imagen para eliminar.");
    }

    try {
        const urlObj = new URL(cancha.ImagenURL);
        const pathIndex = urlObj.pathname.indexOf("/canchas/");
        if (pathIndex !== -1 && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
            const filePath = urlObj.pathname.substring(pathIndex + "/canchas/".length);
            const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
            await supabase.storage.from("canchas").remove([filePath]);
        }
    } catch (err) {
        console.warn("Error al intentar borrar el archivo de Supabase Storage:", err);
    }

    await CanchaRepository.actualizarCancha(canchaId, { imagenUrl: null });
    return { mensaje: "Imagen de cancha eliminada exitosamente." };
}