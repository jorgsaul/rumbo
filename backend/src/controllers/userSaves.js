import { pool } from "../config/dataBase.js";

async function funcionFavoritos(userID, postID){
  try {
    const [rows] = await pool.query('CALL spTogglePostFavorite(?, ?)', [userID, postID]);
    if(rows.length > 0) {
      return rows[0];
    }else{
      return [];
    }
  } catch (error) {
    console.error('Error al hacer toggle favorites: ', error)
    throw error;
  }
  
}

export default funcionFavoritos;