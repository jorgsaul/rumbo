import { pool } from "../config/dataBase.js";

export async function actualizarCuenta(id, full_name, bio, avatar_url, banner_url) {
  try {
    await pool.query("SELECT spupdateuserprofile($1, $2, $3, $4, $5);",
      [id, full_name, bio, avatar_url, banner_url]
    );
  } catch (error) {
    console.error("Error al actualizar la cuenta:", error);
  }
};