import express from "express";
import { crearCuenta, validarUsuarioExistente, obtenerUsuario, autoLogin } from "../controllers/crearCuenta.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/crearCuenta", async (req, res) => {
  const { tipoUsuario, correo, usuario, password } = req.body;
  try {
    await crearCuenta(tipoUsuario, correo, usuario, password);
    res.json({ message: "Cuenta creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la cuenta:", error);
    res.status(500).json({ error: "Error al crear la cuenta" });
  }
});

router.get('/validarUsuarioExistente', async (req, res) => {
  try {
    const { usuario, correo } = req.query;
    
    if (!usuario || !correo) {
      return res.status(400).json({ error: "Usuario y correo son requeridos" });
    }
    const existe = await validarUsuarioExistente(usuario, correo);
    
    console.log("🔍 Validación - Usuario:", usuario, "Correo:", correo);
    console.log("📊 Resultado existe:", existe);
    res.json({ 
      existe: existe,
      mensaje: existe ? "El usuario o correo ya existe" : "Disponible"
    });
    
  } catch (error) {
    console.error("Error en endpoint validarUsuarioExistente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post('/signIn', async (req, res) => {
  const {identificador, rol} = req.body;
  const user = await obtenerUsuario(identificador);
  if(!user){
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  const token = jwt.sign({ id:user.id, rol }, process.env.JWT_SECRET);

  res.cookie('token', token, { 
    httpOnly: true, 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ success: true });
});

router.post('/auto-login', async (req, res) => {
  const { identificador } = req.body;
  
  try {
    const user = await autoLogin(identificador);
    
    if (user) {
      const token = jwt.sign({ 
        id: user.id, 
        rol: user.role 
      }, process.env.JWT_SECRET);

      res.cookie('token', token, { 
        httpOnly: true, 
        sameSite: process.env.NODE_ENV === 'production'? 'none' : 'lax', 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log('✅ Auto-login exitoso para:', user.id);
      res.json({ success: true, user });
    } else {
      res.json({ success: false, error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error en auto-login:", error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});
export default router;