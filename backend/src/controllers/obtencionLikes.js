import { pool } from '../config/dataBase.js';

async function funcionLikes(usuarioID, postID) {
  try {
    const result = await pool.query(`SELECT sptogglepostlike($1, $2)`, [usuarioID, postID]);
    if(result.rows.length > 0) {
      return result.rows[0];
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al hacer toggle like: ', error);
    throw error;
  }
}

export { funcionLikes };