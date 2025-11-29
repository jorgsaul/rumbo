import { pool } from "../config/dataBase.js";

export const reportarPost = async (postId, userId) => {
  try {
    console.log('📝 Ejecutando SP para reportar post:', { postId, userId });
    
    const result = await pool.query(
      'CALL sp_report_post($1, $2)',
      [postId, userId]
    );

    const postStatus = await pool.query(
      'SELECT * FROM sp_get_post_reports($1)',
      [postId]
    );

    return { 
      success: true, 
      reportCount: postStatus.rows[0]?.report_count || 0,
      hidden: postStatus.rows[0]?.is_hidden || false,
      message: postStatus.rows[0]?.is_hidden ? 'Post ocultado por múltiples reportes' : 'Reporte registrado'
    };
  } catch (error) {
    console.error('Error al reportar post:', error);
    throw error;
  }
};