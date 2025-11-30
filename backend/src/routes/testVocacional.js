import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {pool} from '../config/dataBase.js';

const router = express.Router();

router.post('/guardar-resultados', authenticateUser, async (req, res) => {
  try {
    const { 
      resultados, 
      perfilVocacional, 
      respuestasUsuario,
      zonaIkigai 
    } = req.body;
    
    const userId = req.user.id;

    console.log('📥 Guardando resultados para usuario:', userId);

    const scoreGlobal = resultados.reduce((sum, carrera) => 
      sum + carrera.puntuacion, 0) / resultados.length;

    const query = `
      INSERT INTO user_vocational_results 
        (user_id, perfil_tecnologico, perfil_cientifico, perfil_salud, 
         perfil_administrativo, perfil_social, top_carreras, respuestas_usuario,
         resultados_completos, score_global, zona_ikigai)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      userId,
      perfilVocacional.tecnologico?.valor || 0,
      perfilVocacional.cientifico?.valor || 0,
      perfilVocacional.salud?.valor || 0,
      perfilVocacional.administrativo?.valor || 0,
      perfilVocacional.social?.valor || 0,
      JSON.stringify(resultados.slice(0, 10)),
      JSON.stringify(respuestasUsuario),
      JSON.stringify(resultados),
      scoreGlobal.toFixed(2),
      zonaIkigai
    ];

    const result = await pool.query(query, values);
    
    console.log('✅ Resultados guardados correctamente');
    
    res.status(201).json({
      success: true,
      message: 'Resultados guardados correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error guardando resultados vocacionales:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
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