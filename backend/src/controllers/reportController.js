import { pool } from "../config/dataBase.js";

export const reportarPost = async (postId, userId) => {
  try {
    console.log('📝 Ejecutando SP para reportar post:', { postId, userId });
    
    await pool.query(
      'CALL sp_report_post($1, $2)',
      [postId, userId]
    );

    const postStatus = await pool.query(
      `SELECT 
          COALESCE(report_count, 0) as report_count,
          COALESCE(is_hidden, false) as is_hidden
       FROM _posts 
       WHERE id = $1`,
      [postId]
    );

    const status = postStatus.rows[0] || { report_count: 0, is_hidden: false };

    return { 
      success: true, 
      reportCount: status.report_count,
      hidden: status.is_hidden,
      message: status.is_hidden ? 
        '✅ Publicación ocultada por múltiples reportes' : 
        `📝 Reporte registrado (${status.report_count}/4 reportes)`
    };
  } catch (error) {
    console.error('Error al reportar post:', error);
    throw error;
  }
};