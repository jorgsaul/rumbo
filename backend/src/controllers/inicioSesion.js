import { pool } from "../config/dataBase.js";

async function iniciarSesion(identificador, contraseña) {
  try {
    const result = await pool.query('CALL sploginuser($1, $2)', [identificador, contraseña]);
    
    if (result.rows.length > 0) {
      return { success: true, user: result.rows[0] };
    }
    return { success: false };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

export { iniciarSesion };