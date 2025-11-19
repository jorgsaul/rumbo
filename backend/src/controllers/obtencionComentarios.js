import { pool } from "../config/dataBase.js";

export async function obtenerComentarios(postID) {
  try {
    const result = await pool.query("SELECT * FROM spgetcomments($1)", [postID]);
    if(result.rows && result.rows.length > 0) {
      return result.rows[0];
    }else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
}