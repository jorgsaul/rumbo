import { pool } from "../config/dataBase.js";

async function funcionSubirPost(author_id, title, content, media_url, tags) {
  try {
    const result = await pool.query('CALL spinsertpost($1, $2, $3, $4, $5)', [author_id, title, content, media_url, JSON.stringify(tags)]);
    if(result.rows.length > 0) {
      return result.rows;
    }else {
      return [];
    }
  } catch (error) {
    console.error('Error al subir el post:', error);
    throw error;
  }
}

export default funcionSubirPost;