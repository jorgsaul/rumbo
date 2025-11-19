import { pool } from "../config/dataBase.js";

export const crearCuenta = async (tipoUsuario, correo, usuario, password) => {
  try {
    await pool.query("CALL spcreateuser(?, ?, ?, ?);",
      [usuario, correo, password, tipoUsuario]
    );
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
  }
};

export const validarUsuarioExistente = async (usuario, correo) => {
  const [rows] = await pool.query("SELECT spcheckuserexists(?, ?);", [
    usuario,
    correo,
  ]);
  return rows[0];
};

export const obtenerUsuario = async (identificador) => {
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE username = ?", [identificador]);
    if (rows.length > 0) {
      return rows[0];
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error); 
  }
}