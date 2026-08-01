import * as reservasRepository from "./reservas.repository.js";
import * as canchasService from "../canchas/canchas.service.js";
import * as promocionesService from "../promociones/promociones.service.js";
import { ApiError } from "../../utils/ApiError.js";

const ISV = 0.15;

const ESTADOS_ACTIVOS = ["Pendiente","Confirmada"];
const ESTADOS_VALIDOS_ADMIN = ["Pendiente", "Confirmada", "Completada"];

//funcion para validar los campos ingresados a la hora de llenar los ddatos de una reserva
export async function validarCamposReserva(campos) {
  const { canchaId, fecha, horaInicio, horaFin} = campos;

  if(!canchaId || !fecha || !horaInicio || !horaFin){
    throw new ApiError (400, "Tienes que completar el ID de la cancha , la fecha, hora de inicio y hora fin.");

  }

  const hoy = new Date ();
  hoy.setHours(0,0,0,0);
  const [y,m,d] = fecha.split("-");
  const fechaCampo = new Date(y, m -1 , d);

  if (horaFin <= horaInicio){
    throw new ApiError (400, "Lo hora de fin debe ser posterior a la hora inicial de la reserva de la cancha.");
  }

  if (fechaCampo < hoy ){
    throw new ApiError (400, "No puedes reservar a una fecha pasada.");
  }
  
}


function agruparReserva(filas) {
  if (!filas || filas.length === 0) return null;
 
  const primera = filas[0];
  return {
    reservaId: primera.reservaid,
    usuarioId: primera.usuarioid,
    fechaReserva: primera.fechareserva,
    estadoReserva: primera.estadoreserva,
    total: primera.total,
    fechaModificacion: primera.fechamodificacion,
    bloques: filas.map((f) => ({
      detalleReservaId: f.detallereservaid,
      canchaId: f.canchaid,
      nombreCancha: f.nombrecancha,
      nombreTipo: f.nombretipo,
      fecha: f.fecha,
      horaInicio: f.horainicio,
      horaFin: f.horafin,
      precioHora: f.preciohora,
      subtotal: f.subtotal,
    })),
  };
}

export function agruparListado(filas) {
  const mapa = new Map();
 
  for (const f of filas) {
    if (!mapa.has(f.reservaid)) {
      mapa.set(f.reservaid, {
        reservaId: f.reservaid,
        usuarioId: f.usuarioid,
        // Solo viene en obtenerTodasLasReservas (admin); undefined en "mis reservas".
        cliente: f.primernombre
          ? { primerNombre: f.primernombre, primerApellido: f.primerapellido, correo: f.correo }
          : undefined,
        fechaReserva: f.fechareserva,
        estadoReserva: f.estadoreserva,
        total: f.total,
        fechaModificacion: f.fechamodificacion,
        bloques: [],
      });
    }
    mapa.get(f.reservaid).bloques.push({
      detalleReservaId: f.detallereservaid,
      canchaId: f.canchaid,
      nombreCancha: f.nombrecancha,
      nombreTipo: f.nombretipo,
      fecha: f.fecha,
      horaInicio: f.horainicio,
      horaFin: f.horafin,
      precioHora: f.preciohora,
      subtotal: f.subtotal,
    });
  }
 
  return Array.from(mapa.values());
}



// esta funcion calcula las horas  y la podremos usar cuando quieran alquilar por mas de una hora o todo un dia para hacer el calculo del precio mas facil.
export async function calcularHoras(horaInicio, horaFin) {
  const [hIni, mIni] = horaInicio.split(":").map(Number);
  const [hFin, mFin] = horaFin.split(":").map(Number);
  return (hFin * 60 + mFin - (hIni * 60 + mIni)) / 60;
  
}

//mostrar todas las reservas para el administrador
export async function obtenerTodasLasReservas() {
  const filas = await reservasRepository.obtenerTodasLasReservas();
  return agruparListado(filas);
}

export async function obtenerReservaPorId(reservaId, usuarioId, esAdmin = false) {
  const filas = await reservasRepository.obtenerReservaPorId(reservaId);
  const reserva = agruparReserva(filas)

  if (!reserva){
    throw new ApiError (400, "No se encontro la reserva");

  }
  if (!esAdmin && reserva.usuarioId !== usuarioId){
    throw new ApiError (400 , "No tienes permiso para ver esta reserva.");
  }
  return reserva;
  
}

//mostrar las reservas unicamente del usuario 
export async function obtenerMisReservas(usuarioId) {
  const filas = await reservasRepository.obtenerReservaPorUsuario(usuarioId);
  return agruparListado(filas);
  
}

//solo exportamos la funcion desde la canchas servicce para ver los horarios disponibles
export async function obtenerDisponibilidad(canchaId, fecha) {
  return await canchasService.obtenerDisponibilidad(canchaId,fecha);
  
}

//funcion para poder actualizar la tabla de reservas cuando hagamos o cancelemos una reserva
export async function actualizarEstadoReserva(reservaId, nuevoEstado) {
  if (!ESTADOS_VALIDOS_ADMIN.includes(nuevoEstado)) {
    throw new ApiError(
      400,
      `Estado inválido. Usa uno de: ${ESTADOS_VALIDOS_ADMIN.join(", ")}. Para cancelar, usa el endpoint de cancelación.`
    );
  }
 
  const encabezado = await reservasRepository.obtenerEncabezadoReserva(reservaId);
  if (!encabezado) {
    throw new ApiError(404, "Reserva no encontrada.");
  }
 
  return await reservasRepository.actualizarEstadoReserva(reservaId, nuevoEstado);
}
 

//funcion para cuando se consulte un horario que antes fue cancelado por otro usuario para que no aparezca debido al exclude de nuestra base de datos 
function ErrordeInsertart(err) {
  if (err.code === "23P01") {
    throw new ApiError(409, "Ese horario ya está reservado para esa cancha. Elige otro horario.");
  }
  throw err;
}
 
//crear una reserva llenando todos los bloqes del formulario
export async function crearReserva(usuarioId, camposSolicitados) {
  if (!Array.isArray(camposSolicitados) || camposSolicitados.length === 0){
    throw new ApiError (400, "Debes colocar todos los campos para poder crear una reserva.");
  }

  const bloquesParaInsertar = [];
  let total = 0;

  for (const bloque of camposSolicitados){
    await validarCamposReserva(bloque);

    const cancha = await canchasService.obtenerCanchaPorId(bloque.canchaId);

    if (cancha.Estado !== "Disponible"){
      throw new ApiError (400,  `La cancha "${cancha.NombreCancha}" no esta disponible en este momento. `);

    }

    const horas = await calcularHoras(bloque.horaInicio, bloque.horaFin);
    const subtotalBruto = Number((cancha.PrecioPorHora * horas).toFixed(2));

    // Sistema Experto: buscar promoción activa para este bloque
    const promocion = await promocionesService.buscarPromocionAplicable(
      bloque.fecha,
      bloque.horaInicio
    );

    let descuento = 0;
    let promocionId = null;
    if (promocion) {
      descuento = Number((subtotalBruto * (promocion.porcentajedescuento / 100)).toFixed(2));
      promocionId = promocion.promocionid;
    }

    const subtotal = Number((subtotalBruto - descuento).toFixed(2));

    bloquesParaInsertar.push({
      canchaId: bloque.canchaId,
      fecha: bloque.fecha,
      horaInicio: bloque.horaInicio,
      horaFin: bloque.horaFin,
      precioHora: cancha.PrecioPorHora,
      subtotal,
      descuento,
      promocionId,
    });
    total += subtotal;
  }

  total = Number((total * (1 + ISV)).toFixed(2));

  try {
    const reservaId = await reservasRepository.crearReservaConDetalle({
      usuarioId,
      total,
      bloques: bloquesParaInsertar,
    });
    return await obtenerReservaPorId(reservaId, usuarioId, true);
  } catch (err) {
    ErrordeInsertart(err);
  }
}

export async function cancelarReserva(reservaId, usuarioId, esAdmin = false) {
  const encabezado = await reservasRepository.obtenerEncabezadoReserva(reservaId);
 
  if (!encabezado) {
    throw new ApiError(404, "Reserva no encontrada.");
  }
  if (!esAdmin && encabezado.usuarioid !== usuarioId) {
    throw new ApiError(403, "No tienes permiso para cancelar esta reserva.");
  }
  if (!ESTADOS_ACTIVOS.includes(encabezado.estadoreserva)) {
    throw new ApiError(400, `No se puede cancelar una reserva en estado "${encabezado.estadoreserva}".`);
  }
 
  return await reservasRepository.cancelarReserva(reservaId);
}