import {pool} from "../config/dataBase.js";

export const crearComentario = async (postID, userID, comentario) => {
  try {
    await pool.query("CALL spcreatecomment($1, $2, $3);", [postID, userID, comentario]);
  } catch (error) {
    console.error("Error al crear el comentario:", error);
  }
};