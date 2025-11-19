import { pool } from "../config/dataBase.js";

export const cambiarContrasena = async (correo, nuevaContrasena) => {
  try {
    await pool.query("CALL spchangepassword(?, ?);", [correo, nuevaContrasena]);
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
  }
};