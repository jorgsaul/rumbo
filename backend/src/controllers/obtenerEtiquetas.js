import {pool} from "../config/dataBase.js";

export default async function obtenerEtiquetas() {
  try {
    const result = await pool.query("SELECT * FROM spgettags()");
    if(result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error al obtener las etiquetas:", error);
  }
}