import express from "express";
import { buscarPerfil } from "../controllers/buscarPerfil.js";

const router = express.Router();

router.get("/buscar-perfil", async (req, res) => {
  const { entrada } = req.query;
  try {
    const perfil = await buscarPerfil(entrada);
    res.json(perfil);
  } catch (error) {
    console.error("Error al buscar el perfil:", error);
    res.status(500).json({ error: "Error al buscar el perfil" });
  }
});

export default router;