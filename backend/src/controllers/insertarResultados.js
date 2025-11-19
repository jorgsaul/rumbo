import { pool } from "../config/dataBase.js";

async function insertarResultados(userId, testId, score) {
  try {
    const result = await pool.query('CALL spinserttestresult($1, $2, $3)', [userId, testId, score]);
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al insertar los resultados:', error);
    throw error;
  }
}

export {insertarResultados};