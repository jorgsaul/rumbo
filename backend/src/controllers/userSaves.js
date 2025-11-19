import { pool } from "../config/dataBase.js";

async function funcionFavoritos(userID, postID){
  try {
    const result = await pool.query('CALL sptogglepostfavorite($1, $2)', [userID, postID]);
    if(result.rows.length > 0) {
      return result.rows;
    }else{
      return [];
    }
  } catch (error) {
    console.error('Error al hacer toggle favorites: ', error)
    throw error;
  }
  
}

export default funcionFavoritos;