import {pool} from '../config/dataBase.js';

export default async function obtenerPostsEtiquetas(etiquetas) {
  try {
    const [rows] = await pool.query("CALL spGetPostsByTags(?)", [etiquetas]);
    
    if (rows && rows.length > 0) {
      return rows[0];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los posts por etiqueta:", error);
    throw error;
  }
}