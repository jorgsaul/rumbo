import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { obtenerDatosUsuario } from '../controllers/userData.js';
import { actualizarCuenta } from '../controllers/actualizarCuenta.js';
import { insertarResultados } from '../controllers/insertarResultados.js';
import { obtenerDatosTest } from '../controllers/obtenerDatosTest.js';

const router = express.Router();

router.get('/perfil', authenticateUser, async (req, res) => {
  const userID = req.user.id;

  try {
    const datosUsuario = await obtenerDatosUsuario(userID);
    res.json(datosUsuario);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});

router.get('/perfil-externo', async (req, res) => {
  const userID = req.query.usuarioExternoId;

  try {
    const datosUsuario = await obtenerDatosUsuario(userID);
    res.json(datosUsuario);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});

router.put('/actualizar-perfil', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { full_name, bio, avatar_url, banner_url } = req.body;

  if(!userId || !full_name || !bio) return res.status(400).json({ error: 'Faltan datos' });

  try{
    await actualizarCuenta(userId, full_name, bio, avatar_url, banner_url);
    res.json({ message: 'Cuenta actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la cuenta:', error);
    res.status(500).json({ error: 'Error al actualizar la cuenta' });
  }
})

router.post('/insertar-resultados', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { testId, score } = req.body;
  if(!userId || !testId || !score) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const result = await insertarResultados(userId, testId, score);
    res.json(result);
  } catch (error) {
    console.error('Error al insertar los resultados:', error);
    res.status(500).json({ error: 'Error al insertar los resultados' });
  }
});

router.get('/obtener-resultados', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await obtenerDatosTest(userId);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
})

export default router;