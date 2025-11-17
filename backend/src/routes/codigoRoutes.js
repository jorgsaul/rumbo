import express from "express";
import { enviarCodigo, validarCodigo } from "../controllers/codeValidation.js";

const router = express.Router();

router.post('/enviarCorreo', async (req, res) => {
  const {correo} = req.body;
  if(!correo) res.status(400).json({error: 'Falta el correo'});

  try {
    const resultado = await enviarCodigo(correo);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

router.post('/validarCodigo', async (req, res) => {
  const {correo, codigo, entrada} = req.body;
  if(!correo || !entrada) res.status(400).json({error: 'Faltan parámetros'});
  try {
    const resultado = await validarCodigo(correo, codigo, entrada);
    if(resultado) res.json({message: 'Codigo correcto'});
    else res.status(400).json({error: 'Codigo incorrecto'});
  } catch (error) {
    res.status(500).json({ error: 'No se pudo validar el correo' });
  }
})

export default router;