import { pool } from '../config/dataBase.js';

async function obtenerPosts(filtro, usuarioIdPerfil, usuarioIdSesion) {
  try {
    const [rows] = await pool.query(`CALL spGetUserContent(?, ?, ?)`, [filtro, usuarioIdPerfil, usuarioIdSesion]);
    if(rows.length > 0) {
      return rows[0];
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al obtener los posts:', error);
    throw error;
  }
}

export { obtenerPosts };