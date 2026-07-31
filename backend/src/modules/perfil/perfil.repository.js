// Queries SQL para el perfil propio del usuario autenticado.
// A diferencia de usuarios.repository.js (solo para admins),
// aquí el usuario solo puede leer/editar sus propios datos.

import { pool } from "../../config/db.js";

/* GET - Perfil completo del usuario autenticado */
export async function obtenerPerfilPorUsuarioId(usuarioId) {
  const { rows } = await pool.query(
    `SELECT u.UsuarioID, u.PersonaID, u.RolID, u.NombreUsuario, u.EstadoUsuario,
            u.FechaCreacion, u.FechaModificacion,
            r.NombreRol,
            p.PrimerNombre, p.SegundoNombre, p.PrimerApellido, p.SegundoApellido,
            p.NumeroIdentidad, p.RTN, p.Correo, p.Telefono, p.Direccion,
            p.FotoPerfilURL,
            COALESCE(res.TotalReservas, 0) AS TotalReservas
       FROM Usuarios u
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN Roles r ON r.RolID = u.RolID
       LEFT JOIN (
         SELECT UsuarioID, COUNT(*) AS TotalReservas
           FROM Reservas
          GROUP BY UsuarioID
       ) res ON res.UsuarioID = u.UsuarioID
      WHERE u.UsuarioID = $1
      LIMIT 1`,
    [usuarioId]
  );

  if (!rows[0]) return null;
  const row = rows[0];
  return {
    UsuarioID:         row.usuarioid,
    PersonaID:         row.personaid,
    RolID:             row.rolid,
    NombreRol:         row.nombrerol,
    NombreUsuario:     row.nombreusuario,
    EstadoUsuario:     row.estadousuario,
    FechaCreacion:     row.fechacreacion,
    FechaModificacion: row.fechamodificacion,
    PrimerNombre:      row.primernombre,
    SegundoNombre:     row.segundonombre,
    PrimerApellido:    row.primerapellido,
    SegundoApellido:   row.segundoapellido,
    NumeroIdentidad:   row.numeroidentidad,
    RTN:               row.rtn,
    Correo:            row.correo,
    Telefono:          row.telefono,
    Direccion:         row.direccion,
    FotoPerfilURL:     row.fotoperfilurl,
    TotalReservas:     Number(row.totalreservas),
  };
}

/* PUT - Actualizar solo los campos de Personas (no toca Usuarios) */
export async function actualizarDatosPersona(personaId, {
  primerNombre, segundoNombre, primerApellido, segundoApellido,
  numeroIdentidad, rtn, correo, telefono, direccion,
}) {
  await pool.query(
    `UPDATE Personas SET
        PrimerNombre    = COALESCE($1, PrimerNombre),
        SegundoNombre   = $2,
        PrimerApellido  = COALESCE($3, PrimerApellido),
        SegundoApellido = $4,
        NumeroIdentidad = $5,
        RTN             = $6,
        Correo          = COALESCE($7, Correo),
        Telefono        = COALESCE($8, Telefono),
        Direccion       = $9
      WHERE PersonaID = $10`,
    [
      primerNombre,
      segundoNombre || null,
      primerApellido,
      segundoApellido || null,
      numeroIdentidad || null,
      rtn || null,
      correo,
      telefono,
      direccion || null,
      personaId,
    ]
  );
  // Actualizamos FechaModificacion en Usuarios también
  await pool.query(
    `UPDATE Usuarios SET FechaModificacion = CURRENT_TIMESTAMP WHERE PersonaID = $1`,
    [personaId]
  );
}

/* PATCH - Actualizar solo la URL de la foto de perfil */
export async function actualizarFotoPerfilURL(personaId, url) {
  await pool.query(
    `UPDATE Personas SET FotoPerfilURL = $1 WHERE PersonaID = $2`,
    [url, personaId]
  );
}

/* GET - Obtener solo el hash de contraseña actual (para validar en cambio de clave) */
export async function obtenerHashContrasena(usuarioId) {
  const { rows } = await pool.query(
    `SELECT Contrasena FROM Usuarios WHERE UsuarioID = $1`,
    [usuarioId]
  );
  return rows[0]?.contrasena || null;
}

/* PATCH - Guardar nueva contraseña ya hasheada */
export async function actualizarContrasena(usuarioId, contrasenaHash) {
  await pool.query(
    `UPDATE Usuarios
        SET Contrasena = $1, FechaModificacion = CURRENT_TIMESTAMP
      WHERE UsuarioID = $2`,
    [contrasenaHash, usuarioId]
  );
}

/* VALIDATE - Unicidad de correo excluyendo al propio usuario */
export async function correoEnUso(correo, excluirPersonaId) {
  const { rows } = await pool.query(
    `SELECT 1 FROM Personas WHERE Correo = $1 AND PersonaID != $2 LIMIT 1`,
    [correo, excluirPersonaId]
  );
  return rows.length > 0;
}

/* VALIDATE - Unicidad de identidad/RTN excluyendo a la propia persona */
export async function identidadORtnEnUso(numeroIdentidad, rtn, excluirPersonaId) {
  if (!numeroIdentidad && !rtn) return false;

  const condiciones = [];
  const params = [excluirPersonaId];
  let i = 2;

  if (numeroIdentidad) {
    condiciones.push(`NumeroIdentidad = $${i++}`);
    params.push(numeroIdentidad);
  }
  if (rtn) {
    condiciones.push(`RTN = $${i++}`);
    params.push(rtn);
  }

  const { rows } = await pool.query(
    `SELECT 1 FROM Personas WHERE (${condiciones.join(" OR ")}) AND PersonaID != $1 LIMIT 1`,
    params
  );
  return rows.length > 0;
}
