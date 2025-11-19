import { pool } from "../config/dataBase.js";

async function obtenerDatosUsuario(userID) {
  try {
    const [rows] = await pool.query('CALL spgetuserdata(?)', [userID]);
    if(rows.length > 0) {
      return rows[0][0];
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
}

export { obtenerDatosUsuario };