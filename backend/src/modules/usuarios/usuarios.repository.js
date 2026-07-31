// Queries SQL contra las tablas Usuarios, Personas, Roles.

import { pool } from "../../config/db.js";

function mapearUsuario(row) {
  if (!row) return null;
  return {
    UsuarioID: row.usuarioid,
    PersonaID: row.personaid,
    RolID: row.rolid,
    NombreRol: row.nombrerol,
    NombreUsuario: row.nombreusuario,
    EstadoUsuario: row.estadousuario,
    FechaCreacion: row.fechacreacion,
    FechaModificacion: row.fechamodificacion,
    PrimerNombre: row.primernombre,
    SegundoNombre: row.segundonombre,
    PrimerApellido: row.primerapellido,
    SegundoApellido: row.segundoapellido,
    NumeroIdentidad: row.numeroidentidad,
    RTN: row.rtn,
    Correo: row.correo,
    Telefono: row.telefono,
    Direccion: row.direccion,
    FotoPerfilURL: row.fotoperfilurl,
    ...(row.totalreservas !== undefined ? { TotalReservas: Number(row.totalreservas) } : {}),
    ...(row.totalregistros !== undefined ? { TotalRegistros: Number(row.totalregistros) } : {}),
  };
}

/* GET - Lista paginada de usuarios, con filtro opcional por rol y búsqueda */
export async function obtenerUsuarios({ limit, offset, rolId = null, busqueda = null }) {
  const { rows } = await pool.query(
    `SELECT u.UsuarioID, u.PersonaID, u.RolID, u.NombreUsuario, u.EstadoUsuario,
            u.FechaCreacion, u.FechaModificacion,
            r.NombreRol,
            p.PrimerNombre, p.SegundoNombre, p.PrimerApellido, p.SegundoApellido,
            p.NumeroIdentidad, p.RTN, p.Correo, p.Telefono, p.Direccion, p.FotoPerfilURL,
            COALESCE(res.TotalReservas, 0) AS TotalReservas,
            COUNT(*) OVER() AS totalRegistros
       FROM Usuarios u
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN Roles r ON r.RolID = u.RolID
       LEFT JOIN (
         SELECT UsuarioID, COUNT(*) AS TotalReservas
           FROM Reservas
          GROUP BY UsuarioID
       ) res ON res.UsuarioID = u.UsuarioID
      WHERE ($1::int IS NULL OR u.RolID = $1)
        AND ($2::text IS NULL OR (
              p.PrimerNombre ILIKE '%' || $2 || '%' OR
              p.PrimerApellido ILIKE '%' || $2 || '%' OR
              p.Correo ILIKE '%' || $2 || '%' OR
              u.NombreUsuario ILIKE '%' || $2 || '%'
            ))
      ORDER BY u.FechaCreacion DESC
      LIMIT $3 OFFSET $4`,
    [rolId, busqueda, limit, offset]
  );
  return rows.map(mapearUsuario);
}

/* GET - Un usuario por su ID */
export async function obtenerUsuarioPorId(usuarioId) {
  const { rows } = await pool.query(
    `SELECT u.UsuarioID, u.PersonaID, u.RolID, u.NombreUsuario, u.EstadoUsuario,
            u.FechaCreacion, u.FechaModificacion,
            r.NombreRol,
            p.PrimerNombre, p.SegundoNombre, p.PrimerApellido, p.SegundoApellido,
            p.NumeroIdentidad, p.RTN, p.Correo, p.Telefono, p.Direccion, p.FotoPerfilURL
       FROM Usuarios u
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN Roles r ON r.RolID = u.RolID
      WHERE u.UsuarioID = $1
      LIMIT 1`,
    [usuarioId]
  );
  return mapearUsuario(rows[0]);
}

/* GET - Catálogo de roles (para el <select> del formulario) */
export async function obtenerRoles() {
  const { rows } = await pool.query(
    `SELECT RolID, NombreRol, Descripcion FROM Roles ORDER BY RolID`
  );
  return rows.map((r) => ({
    RolID: r.rolid,
    NombreRol: r.nombrerol,
    Descripcion: r.descripcion,
  }));
}

/* VALIDATE - Verificar si un RolID existe */
export async function existeRolId(rolId) {
  const { rows } = await pool.query(`SELECT 1 FROM Roles WHERE RolID = $1`, [rolId]);
  return rows.length > 0;
}

/* VALIDATE - Verificar si ya existe otro usuario con ese correo o nombre de usuario.
 * Si excluirUsuarioId viene, lo ignora (para permitir editar sin chocar consigo mismo). */
export async function existeCorreoOUsuario(correo = null, nombreUsuario = null, excluirUsuarioId = null) {
  if (!correo && !nombreUsuario) return false;

  const condiciones = [];
  const params = [];
  let i = 1;
  if (correo) { condiciones.push(`p.Correo = $${i++}`); params.push(correo); }
  if (nombreUsuario) { condiciones.push(`u.NombreUsuario = $${i++}`); params.push(nombreUsuario); }

  let query = `SELECT 1 FROM Personas p JOIN Usuarios u ON u.PersonaID = p.PersonaID WHERE (${condiciones.join(" OR ")})`;
  if (excluirUsuarioId) { query += ` AND u.UsuarioID != $${i++}`; params.push(excluirUsuarioId); }
  query += ` LIMIT 1`;

  const { rows } = await pool.query(query, params);
  return rows.length > 0;
}

/* VALIDATE - Igual que arriba pero para NumeroIdentidad/RTN */
export async function existeIdentidadORtn(numeroIdentidad = null, rtn = null, excluirUsuarioId = null) {
  if (!numeroIdentidad && !rtn) return false;

  const condiciones = [];
  const params = [];
  let i = 1;
  if (numeroIdentidad) { condiciones.push(`p.NumeroIdentidad = $${i++}`); params.push(numeroIdentidad); }
  if (rtn) { condiciones.push(`p.RTN = $${i++}`); params.push(rtn); }

  let query = `SELECT 1 FROM Personas p JOIN Usuarios u ON u.PersonaID = p.PersonaID WHERE (${condiciones.join(" OR ")})`;
  if (excluirUsuarioId) { query += ` AND u.UsuarioID != $${i++}`; params.push(excluirUsuarioId); }
  query += ` LIMIT 1`;

  const { rows } = await pool.query(query, params);
  return rows.length > 0;
}

/* POST - Crear Persona + Usuario en una misma transacción.
 * A diferencia del registro público (auth.repository.js), aquí el RolID
 * lo decide el admin — no se fuerza a 'Cliente'. */
export async function crearPersonaYUsuario({
  primerNombre, segundoNombre, primerApellido, segundoApellido,
  numeroIdentidad, rtn, correo, telefono, direccion,
  nombreUsuario, contrasenaHash, rolId,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const personaResult = await client.query(
      `INSERT INTO Personas (
          PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido,
          NumeroIdentidad, RTN, Correo, Telefono, Direccion
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING PersonaID`,
      [
        primerNombre, segundoNombre || null, primerApellido, segundoApellido || null,
        numeroIdentidad || null, rtn || null, correo, telefono, direccion || null,
      ]
    );
    const personaId = personaResult.rows[0].personaid;

    const usuarioResult = await client.query(
      `INSERT INTO Usuarios (PersonaID, RolID, NombreUsuario, Contrasena)
       VALUES ($1, $2, $3, $4)
       RETURNING UsuarioID`,
      [personaId, rolId, nombreUsuario, contrasenaHash]
    );
    const usuarioId = usuarioResult.rows[0].usuarioid;

    await client.query("COMMIT");
    return usuarioId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* PUT - Actualizar Persona + Usuario (transacción) */
export async function actualizarUsuario(usuarioId, {
  primerNombre, segundoNombre, primerApellido, segundoApellido,
  numeroIdentidad, rtn, correo, telefono, direccion,
  nombreUsuario, rolId,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: usuarioRows } = await client.query(
      `SELECT PersonaID FROM Usuarios WHERE UsuarioID = $1`,
      [usuarioId]
    );
    const personaId = usuarioRows[0]?.personaid;

    await client.query(
      `UPDATE Personas SET
          PrimerNombre = COALESCE($1, PrimerNombre),
          SegundoNombre = COALESCE($2, SegundoNombre),
          PrimerApellido = COALESCE($3, PrimerApellido),
          SegundoApellido = COALESCE($4, SegundoApellido),
          NumeroIdentidad = COALESCE($5, NumeroIdentidad),
          RTN = COALESCE($6, RTN),
          Correo = COALESCE($7, Correo),
          Telefono = COALESCE($8, Telefono),
          Direccion = COALESCE($9, Direccion)
        WHERE PersonaID = $10`,
      [
        primerNombre, segundoNombre, primerApellido, segundoApellido,
        numeroIdentidad, rtn, correo, telefono, direccion, personaId,
      ]
    );

    await client.query(
      `UPDATE Usuarios SET
          RolID = COALESCE($1, RolID),
          NombreUsuario = COALESCE($2, NombreUsuario),
          FechaModificacion = CURRENT_TIMESTAMP
        WHERE UsuarioID = $3`,
      [rolId, nombreUsuario, usuarioId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* PATCH - Activar/desactivar usuario */
export async function actualizarEstadoUsuario(usuarioId, estado) {
  const { rows } = await pool.query(
    `UPDATE Usuarios
        SET EstadoUsuario = $1, FechaModificacion = CURRENT_TIMESTAMP
      WHERE UsuarioID = $2
      RETURNING UsuarioID`,
    [estado, usuarioId]
  );
  return rows[0] || null;
}

/* PATCH - Reemplazar la contraseña (ya hasheada) de un usuario */
export async function actualizarContrasena(usuarioId, contrasenaHash) {
  await pool.query(
    `UPDATE Usuarios
        SET Contrasena = $1, FechaModificacion = CURRENT_TIMESTAMP
      WHERE UsuarioID = $2`,
    [contrasenaHash, usuarioId]
  );
}

/* VALIDATE - Si el usuario tiene reservas (como cliente) o facturas (como quien las emitió) */
export async function tieneHistorialAsociado(usuarioId) {
  const { rows } = await pool.query(
    `SELECT 1 FROM Reservas WHERE UsuarioID = $1
     UNION
     SELECT 1 FROM Facturas WHERE UsuarioEmiteID = $1
     LIMIT 1`,
    [usuarioId]
  );
  return rows.length > 0;
}

/* DELETE - Eliminar físicamente Usuario + Persona (transacción) */
export async function eliminarUsuario(usuarioId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT PersonaID FROM Usuarios WHERE UsuarioID = $1`,
      [usuarioId]
    );
    const personaId = rows[0]?.personaid;

    await client.query(`DELETE FROM Usuarios WHERE UsuarioID = $1`, [usuarioId]);
    if (personaId) {
      await client.query(`DELETE FROM Personas WHERE PersonaID = $1`, [personaId]);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
