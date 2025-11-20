import {pool} from '../config/dataBase.js';

export default async function obtenerPostsEtiquetas(etiquetas) {
  try {
    const result = await pool.query("SELECT * FROM spgetpostsbytags($1)", [etiquetas]);
    
    if (result.rows && result.rows.length > 0) {
      return result.rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los posts por etiqueta:", error);
    throw error;
  }
}