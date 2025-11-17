import {pool} from "../config/dataBase.js";

export default async function obtenerEtiquetas() {
  try {
    const [rows] = await pool.query("CALL spGetTags()");
    if(rows.length > 0) {
      return rows[0];
    }
  } catch (error) {
    console.error("Error al obtener las etiquetas:", error);
  }
}