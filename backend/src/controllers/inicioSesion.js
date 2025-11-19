import { pool } from "../config/dataBase.js";

async function iniciarSesion(identificador, contraseña) {
  try {
    const [rows] = await pool.query('CALL sploginuser(?, ?)', [identificador, contraseña]);
    if(rows[0].length > 0){
      return { success: true, user: rows[0][0] };
    }
    return { success: false };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

export { iniciarSesion };