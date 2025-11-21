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

export const validarUsernameExistente = async (usuario) => {
  try {
    const result = await pool.query("SELECT spcheckusernameexists($1) as existe;", [usuario]);
    return result.rows[0].existe;
  } catch (error) {
    console.error("Error en validarUsernameExistente:", error);
    return false;
  }
};

export const obtenerUsuario = async (identificador) => {
  try {
    const result = await pool.query("SELECT id FROM _users WHERE username = $1", [identificador]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error); 
  }
}

export const autoLogin = async (identificador) => {
  try {
    const result = await pool.query("SELECT * FROM spautologin($1)", [identificador]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error("Error en auto-login:", error); 
  }
}