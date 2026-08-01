import {pool} from "../../config/db.js";

function mapearCancha(row) {
    if (!row) return null;
    return {
        CanchaID: row.canchaid,
        TipoCanchaID: row.tipocanchaid,
        NombreCancha: row.nombrecancha,
        Capacidad: row.capacidad,
        PrecioPorHora: row.precioporhora,
        Estado: row.estado,
        Descripcion: row.descripcion,
        ImagenURL: row.imagenurl,
        NombreTipo: row.nombretipo
    };
}

/*GET - Obtener todas las canchas mediante un arreglo rows*/ 
export async function obtenerCanchas() {
    const {rows} = await pool.query(
        `SELECT c.CanchaID, c.NombreCancha, c.Capacidad, c.PrecioPorHora,
                c.Estado, c.Descripcion, c.ImagenURL,
                t.NombreTipo
           FROM Canchas c
           JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
           ORDER BY c.NombreCancha ASC`
    );
    return rows.map(mapearCancha);
}
    
/*GET - Obtener una cancha por su ID*/
export async function obtenerCanchaPorId(canchaId) {
    const {rows} = await pool.query(
        `SELECT c.CanchaID, c.TipoCanchaID, c.NombreCancha, c.Capacidad, c.PrecioPorHora,
                c.Estado, c.Descripcion, c.ImagenURL,
                t.NombreTipo
            FROM Canchas c
            JOIN TiposCancha t ON t.TipoCanchaID = c.TipoCanchaID
            WHERE c.CanchaID = $1
            LIMIT 1`,
        [canchaId]
    );
    return mapearCancha(rows[0]);
}

/*POST - Crear una nueva cancha*/
export async function crearCancha({
  tipoCanchaId, nombreCancha, capacidad, precioPorHora, estado, descripcion, imagenUrl
    }) {
  const { rows } = await pool.query(
        `INSERT INTO Canchas (
                TipoCanchaID, NombreCancha, Capacidad, PrecioPorHora, 
                Estado, Descripcion, ImagenURL
                )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING CanchaID`,
        [
        tipoCanchaId, 
        nombreCancha, 
        capacidad, 
        precioPorHora, 
        estado || 'Disponible',
        descripcion || null, 
        imagenUrl || null
        ]
  );
  return rows[0].canchaid;
}

/*PUT - Actualizar información de una cancha*/
export async function actualizarCancha(canchaId, {
  tipoCanchaId, nombreCancha, capacidad, precioPorHora, estado, descripcion, imagenUrl
}) {
  const { rows } = await pool.query(
    `UPDATE Canchas
        SET TipoCanchaID = COALESCE($1, TipoCanchaID),
            NombreCancha = COALESCE($2, NombreCancha),
            Capacidad = COALESCE($3, Capacidad),
            PrecioPorHora = COALESCE($4, PrecioPorHora),
            Estado = COALESCE($5, Estado),
            Descripcion = COALESCE($6, Descripcion),
            ImagenURL = COALESCE($7, ImagenURL)
      WHERE CanchaID = $8
      RETURNING *`,
    [tipoCanchaId, nombreCancha, capacidad, precioPorHora, estado, descripcion, imagenUrl, canchaId]
  );
  
  return rows[0] || null;
}

/*PATCH - Actualizar estado de una cancha*/
export async function actualizarEstadoCancha(canchaId, nuevoEstado) {
  const { rows } = await pool.query(
        `UPDATE Canchas
            SET Estado = $1
        WHERE CanchaID = $2
        RETURNING *`,
        [nuevoEstado, canchaId]
  );
  
  return rows[0] || null;
}

/*GET - Obtiene horas ya reservadas de una canchas*/
export async function obtenerHorasOcupadas(canchaId, fecha) {
  const { rows } = await pool.query(
    `SELECT HoraInicio, HoraFin 
       FROM DetalleReservas dr
       JOIN Reservas r ON r.ReservaID = dr.ReservaID
      WHERE dr.CanchaID = $1 
        AND dr.Fecha = $2
        AND r.EstadoReserva IN ('Pendiente', 'Confirmada', 'Completada')
      ORDER BY HoraInicio`,
    [canchaId, fecha]
  );
  return rows;
}

/** GET - Horas reservadas para un rango de fechas */
export async function obtenerHorasOcupadasRango(canchaId, fechaInicio, fechaFin) {
  const { rows } = await pool.query(
    `SELECT dr.Fecha, dr.HoraInicio, dr.HoraFin 
       FROM DetalleReservas dr
       JOIN Reservas r ON r.ReservaID = dr.ReservaID
      WHERE dr.CanchaID = $1 
        AND dr.Fecha BETWEEN $2 AND $3
        AND r.EstadoReserva IN ('Pendiente', 'Confirmada', 'Completada')
      ORDER BY dr.Fecha, dr.HoraInicio`,
    [canchaId, fechaInicio, fechaFin]
  );
  return rows;
}

/*VALIDATE - Verificar si existe una cancha con un nombre específico*/
export async function existeNombreCancha(nombreCancha, excluirCanchaId = null) {
  let query = `SELECT 1 FROM Canchas WHERE NombreCancha = $1`;
  const params = [nombreCancha];
  
  if (excluirCanchaId) {
    query += ` AND CanchaID != $2`;
    params.push(excluirCanchaId);
  }
  query += ` LIMIT 1`;
  const { rows } = await pool.query(query, params);
  return rows.length > 0;
}

/*VALIDATE - Verificar si una cancha tiene reservaciones*/
export async function tieneReservas(canchaId) {
  const { rows } = await pool.query(
    `SELECT 1 FROM DetalleReservas WHERE CanchaID = $1 LIMIT 1`,
    [canchaId]
  );
  return rows.length > 0;
}

/*DELETE - Eliminar físicamente una cancha de la base de datos*/
export async function eliminarCancha(canchaId) {
  await pool.query(
    `DELETE FROM Canchas WHERE CanchaID = $1`,
    [canchaId]
  );
}
