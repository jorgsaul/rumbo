import express from 'express';
import { iniciarSesion } from '../controllers/inicioSesion.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/login', async (req, res) => {
  const { identificador, contrasena } = req.body;
  
  if(!identificador || !contrasena) {
    return res.status(400).json({error: 'Faltan parámetros'});
  }
  
  try {
    const resultado = await iniciarSesion(identificador, contrasena);
    
    if(resultado.success){
      const id = resultado.user.id;
      const rol = resultado.user.role;

      const token = jwt.sign({ id, rol }, JWT_SECRET);

      res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict'
      });
    }

    return res.json(resultado);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;