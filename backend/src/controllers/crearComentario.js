import {pool} from "../config/dataBase.js";

export const crearComentario = async (postID, userID, comentario) => {
  try {
    await pool.query("CALL spCreateComment(?, ?, ?);", [postID, userID, comentario]);
  } catch (error) {
    console.error("Error al crear el comentario:", error);
  }
};