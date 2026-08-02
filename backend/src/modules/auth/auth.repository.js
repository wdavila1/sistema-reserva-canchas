import { pool } from "../../config/db.js";

/** Busca un usuario por NombreUsuario o Correo, con su Persona y Rol ya resueltos.
 * Se usa en login. Devuelve también el hash de la contraseña (Contrasena). */
export async function buscarUsuarioParaLogin(identificador) {
  const { rows } = await pool.query(
    `SELECT u.UsuarioID, u.Contrasena, u.EstadoUsuario, u.RolID, u.FechaCreacion,
            r.NombreRol,
            p.PersonaID, p.PrimerNombre, p.PrimerApellido, p.Correo, p.Telefono
       FROM Usuarios u
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN Roles r ON r.RolID = u.RolID
      WHERE u.NombreUsuario = $1 OR p.Correo = $1
      LIMIT 1`,
    [identificador]
  );
  return rows[0] || null;
}

export async function buscarUsuarioPorId(usuarioId) {
  const { rows } = await pool.query(
    `SELECT u.UsuarioID, u.RolID, u.NombreUsuario, u.FechaCreacion, r.NombreRol,
            p.PersonaID, p.PrimerNombre, p.PrimerApellido, p.Correo, p.Telefono,
            p.FotoPerfilURL
       FROM Usuarios u
       JOIN Personas p ON p.PersonaID = u.PersonaID
       JOIN Roles r ON r.RolID = u.RolID
      WHERE u.UsuarioID = $1`,
    [usuarioId]
  );
  return rows[0] || null;
}

export async function existeCorreoOUsuario(correo, nombreUsuario) {
  const { rows } = await pool.query(
    `SELECT 1 FROM Personas WHERE Correo = $1
     UNION
     SELECT 1 FROM Usuarios WHERE NombreUsuario = $2
     LIMIT 1`,
    [correo, nombreUsuario]
  );
  return rows.length > 0;
}

/**
 * Comprueba si NumeroIdentidad o RTN ya están en uso.
 * Retorna un objeto { identidad: boolean, rtn: boolean } para que el service
 * pueda dar un mensaje de error preciso según cuál campo esté duplicado.
 * Solo verifica los valores que no sean null/undefined.
 */
export async function existeIdentidadORtn(numeroIdentidad, rtn) {
  const result = { identidad: false, rtn: false };

  if (numeroIdentidad) {
    const { rows } = await pool.query(
      `SELECT 1 FROM Personas WHERE NumeroIdentidad = $1 LIMIT 1`,
      [numeroIdentidad]
    );
    result.identidad = rows.length > 0;
  }

  if (rtn) {
    const { rows } = await pool.query(
      `SELECT 1 FROM Personas WHERE RTN = $1 LIMIT 1`,
      [rtn]
    );
    result.rtn = rows.length > 0;
  }

  return result;
}

export async function obtenerRolIdPorNombre(nombreRol) {
  const { rows } = await pool.query(`SELECT RolID FROM Roles WHERE NombreRol = $1`, [nombreRol]);
  if (!rows[0]) throw new Error(`El rol "${nombreRol}" no existe en la tabla Roles.`);
  return rows[0].rolid;
}

/** Crea Persona + Usuario dentro de una misma transacción. */
export async function crearPersonaYUsuario({
  primerNombre, segundoNombre, primerApellido, segundoApellido,
  correo, telefono, nombreUsuario, contrasenaHash, rolId,
  numeroIdentidad, rtn, direccion,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const personaResult = await client.query(
      `INSERT INTO Personas (PrimerNombre, SegundoNombre, PrimerApellido, SegundoApellido,
                             Correo, Telefono, NumeroIdentidad, RTN, Direccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING PersonaID`,
      [
        primerNombre, segundoNombre || null, primerApellido, segundoApellido || null,
        correo, telefono,
        numeroIdentidad || null, rtn || null, direccion || null,
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
    return { usuarioId, personaId };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
