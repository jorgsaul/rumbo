import { pool } from "../config/dataBase.js";

export const eliminarMiReporte = async (postId, userId) => {
  try {
    console.log('🗑️ Usuario eliminando su propio reporte:', { postId, userId });
    
    // Verificar si el usuario tiene un reporte en este post
    const reporteCheck = await pool.query(
      'SELECT id FROM _reports WHERE post_id = $1 AND reporter_id = $2',
      [postId, userId]
    );

    if (reporteCheck.rows.length === 0) {
      throw new Error('No tienes un reporte en esta publicación');
    }

    const reportId = reporteCheck.rows[0].id;

    // Eliminar el reporte del usuario
    await pool.query(
      'DELETE FROM _reports WHERE id = $1',
      [reportId]
    );

    // Recalcular reportes pendientes para el post
    const newReportCount = await pool.query(
      `SELECT COUNT(*) as count FROM _reports 
       WHERE post_id = $1 AND status = 'pending'`,
      [postId]
    );

    const count = parseInt(newReportCount.rows[0].count);

    // Actualizar contador en _posts
    await pool.query(
      `UPDATE _posts 
       SET report_count = $1,
           is_hidden = CASE 
             WHEN $1 < 3 THEN false 
             ELSE is_hidden 
           END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [count, postId]
    );

    return { 
      success: true, 
      message: '✅ Reporte eliminado correctamente',
      newReportCount: count,
      postId: postId
    };
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    throw error;
  }
};