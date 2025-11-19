import { pool } from '../config/dataBase.js';
async function obtenerDatosTest(userId) {
  try {
    const result = await pool.query('SELECT * FROM spgetusertests($1)', [userId]);
    if (result.rows.length > 0) {
      return result.rows || [];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos del test:', error);
    throw error;
  }
}

export { obtenerDatosTest };