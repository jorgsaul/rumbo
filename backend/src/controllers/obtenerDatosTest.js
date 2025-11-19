import { pool } from '../config/dataBase.js';
async function obtenerDatosTest(userId) {
  try {
    const [rows] = await pool.query('CALL spgetusertests(?)', [userId]);
    if (rows.length > 0) {
      return rows[0] || [];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener los datos del test:', error);
    throw error;
  }
}

export { obtenerDatosTest };