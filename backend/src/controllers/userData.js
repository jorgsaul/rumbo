import { pool } from "../config/dataBase.js";

async function obtenerDatosUsuario(userID) {
  try {
    const result = await pool.query('SELECT * FROM spgetuserdata($1)', [userID]);
    if(result.rows.length > 0) {
      return result.rows;
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
}

export { obtenerDatosUsuario };