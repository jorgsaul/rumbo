import express from 'express';
import obtenerEtiquetas from '../controllers/obtenerEtiquetas.js';

const router = express.Router();

router.get('/etiquetas', async (req, res) => {
  try {
    const etiquetas = await obtenerEtiquetas();
    res.json(etiquetas);
  } catch (error) {
    console.error('Error al obtener las etiquetas:', error);
    res.status(500).json({ error: 'Error al obtener las etiquetas' });
  }
});

export default router;