import {pool} from "../config/dataBase.js";

export const borrarPublicacion = async (postID, userID) => {
  try {
    await pool.query("CALL spdeletepost($1, $2)", [postID, userID]);
  } catch (error) {
    console.error("Error al borrar la publicación:", error);
  }
};