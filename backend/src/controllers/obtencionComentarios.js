import { pool } from "../config/dataBase.js";

export async function obtenerComentarios(postID) {
  try {
    const [rows] = await pool.query("CALL spGetComments(?)", [postID]);
    if(rows && rows.length > 0) {
      return rows[0];
    }else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);
    throw error;
  }
}