import { pool } from "../config/dataBase.js";

async function funcionSubirPost(author_id, title, content, media_url, tags) {
  try {
    const [rows] = await pool.query('CALL spinsertpost(?, ?, ?, ?, ?)', [author_id, title, content, media_url, JSON.stringify(tags)]);
    if(rows.length > 0) {
      return rows[0];
    }else {
      return [];
    }
  } catch (error) {
    console.error('Error al subir el post:', error);
    throw error;
  }
}

export default funcionSubirPost;
