import { pool } from "../config/dataBase.js";

export const crearCuenta = async (tipoUsuario, correo, usuario, password) => {
  try {
    await pool.query("CALL spcreateuser($1, $2, $3, $4);",
      [usuario, correo, password, tipoUsuario]
    );
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
  }
};

export const validarUsuarioExistente = async (usuario, correo) => {
  const result = await pool.query("SELECT spcheckuserexists($1, $2);", [
    usuario,
    correo,
  ]);
  return result.rows;
};

export const obtenerUsuario = async (identificador) => {
  try {
    const result = await pool.query("SELECT id FROM _users WHERE username = $1", [identificador]);
    if (result.rows.length > 0) {
      return result.rows;
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error); 
  }
}