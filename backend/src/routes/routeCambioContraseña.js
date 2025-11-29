import express from "express";
import { cambiarContrasena } from "../controllers/cambioContraseña.js";

const router = express.Router();

router.post("/cambiarContrasena", async (req, res) => {
  const { correo, contraseña } = req.body;
  if(!correo || !contraseña) return res.status(400).json({error: 'Faltan datos'});
  try {
    await cambiarContrasena(correo, contraseña);
    res.json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  } 
})

export default router;