import { pool } from "../config/dataBase";

export const buscarPerfil = async (entrada) => {
  try {
    const result = await pool.query("CALL sp_buscar_usuarios_relevantes($1)", [entrada]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error al buscar el perfil:", error);
  }
};