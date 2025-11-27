import { pool } from "../config/dataBase.js";

export const buscarPublicaciones = async (terminoBusqueda, usuarioId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM buscar_publicaciones($1, $2)',
      [terminoBusqueda, usuarioId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error en búsqueda de publicaciones:', error);
    throw error;
  }
};