import { pool } from "../config/dataBase.js";

async function insertarResultados(userId, testId, score) {
  try {
    const [rows] = await pool.query('CALL spInsertTestResult(?, ?, ?)', [userId, testId, score]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al insertar los resultados:', error);
    throw error;
  }
}

export {insertarResultados};