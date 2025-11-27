import {pool} from "../config/dataBase.js";

export const borrarPublicacion = async (postID, userID) => {
  try {
    const result = await pool.query("CALL spdeletepost($1, $2)", [postID, userID]);
    return { success: true, message: "Publicación eliminada exitosamente" };
  } catch (error) {
    console.error("Error al borrar la publicación:", error);
    throw error;
  }
};