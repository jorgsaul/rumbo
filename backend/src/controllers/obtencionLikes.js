import { pool } from '../config/dataBase.js';

async function funcionLikes(usuarioID, postID) {
  try {
    const [rows] = await pool.query(`CALL spTogglePostLike(?, ?)`, [usuarioID, postID]);
    if(rows.length > 0) {
      return rows[0];
    }else{
      return [];
    }
  }catch (error) {
    console.error('Error al hacer toggle like: ', error);
    throw error;
  }
}

export { funcionLikes };