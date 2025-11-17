import express from "express";
import { crearCuenta, validarUsuarioExistente, obtenerUsuario } from "../controllers/crearCuenta.js";
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

router.get("/validarUsuarioExistente", async (req, res) => {
  const { usuario, correo } = req.query;
  try {
    const result = await validarUsuarioExistente(usuario, correo);
    res.json(result);
  } catch (error) {
    console.error("Error al validar el usuario:", error);
    res.status(500).json({ error: "Error al validar el usuario" });
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
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Strict'
  });

  res.json({ success: true });
});

export default router;