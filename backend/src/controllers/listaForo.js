import { pool } from '../config/dataBase.js';

async function obtenerPosts(filtro, usuarioIdPerfil, usuarioIdSesion) {
  try {
    const result = await pool.query(`SELECT * FROM spgetusercontent($1, $2, $3)`, [filtro, usuarioIdPerfil, usuarioIdSesion]);
    if(result.rows.length > 0) {
      return result.rows;
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al obtener los posts:', error);
    throw error;
  }
}

export { obtenerPosts };