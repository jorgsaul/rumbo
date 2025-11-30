import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {pool} from '../config/dataBase.js';

const router = express.Router();

// En routes/testVocacional.js - guardar solo IDs
router.post('/guardar-resultados', authenticateUser, async (req, res) => {
  try {
    const { resultados, perfilVocacional, zonaIkigai } = req.body;
    const userId = req.user.id;

    // Guardar solo los IDs de las top 10 carreras
    const topCarrerasIds = resultados.slice(0, 10).map(carrera => ({
      id: carrera.id,
      puntuacion: carrera.puntuacion,
      scores: carrera.scores,
      zona_ikigai: carrera.zona_ikigai
    }));

    const scoreGlobal = resultados.reduce((sum, carrera) => 
      sum + carrera.puntuacion, 0) / resultados.length;

    const query = `
      INSERT INTO user_vocational_results 
        (user_id, perfil_tecnologico, perfil_cientifico, perfil_salud, 
         perfil_administrativo, perfil_social, top_carreras,
         resultados_completos, score_global, zona_ikigai)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      userId,
      perfilVocacional.tecnologico || 0,
      perfilVocacional.cientifico || 0,
      perfilVocacional.salud || 0,
      perfilVocacional.administrativo || 0,
      perfilVocacional.social || 0,
      JSON.stringify(topCarrerasIds), // ← Solo IDs + info del test
      JSON.stringify(resultados), // Todos los resultados
      scoreGlobal.toFixed(2),
      zonaIkigai
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Resultados guardados correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error guardando resultados:', error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
});

router.get('/historial', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT * FROM user_vocational_results 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;