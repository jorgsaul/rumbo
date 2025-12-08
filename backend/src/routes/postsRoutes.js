import express from 'express';
import { funcionLikes } from '../controllers/obtencionLikes.js';
import { obtenerPosts } from '../controllers/listaForo.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { crearComentario } from '../controllers/crearComentario.js';
import { obtenerComentarios } from '../controllers/obtencionComentarios.js';
import funcionSubirPost from '../controllers/uploadPost.js';
import funcionFavoritos from '../controllers/userSaves.js';
import { borrarPublicacion } from '../controllers/borrarPublicacion.js';
import obtenerPostsEtiquetas from '../controllers/obtenerPostsEtiquetas.js';
import { buscarPublicaciones } from '../controllers/buscarPublicacion.js';
import { reportarPost } from '../controllers/reportController.js';
import { pool } from '../config/dataBase.js';

const router = express.Router();

router.get('/posts', authenticateUser, async (req, res) => {
  const filtro = req.query.filtro;
  const usuarioIdPerfil = req.query.usuario_id_perfil;
  const usuarioIdSesion = req.user.id;

  if(!usuarioIdPerfil || !usuarioIdSesion) return res.status(400).json({error: 'Falta el usuario del perfil o el usuario de sesión'});
  if(typeof filtro !== 'string') return res.status(400).json({error: 'Falta el filtro'});
  if(typeof usuarioIdPerfil !== 'string') return res.status(400).json({error: 'Falta el usuario del perfil'});
  if(typeof usuarioIdSesion !== 'string') return res.status(400).json({error: 'Falta el usuario de sesión'});

  try {
    const posts = await obtenerPosts(filtro, usuarioIdPerfil, usuarioIdSesion);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

router.post('/post_like', authenticateUser ,async(req, res)=>{
  const userID = req.user.id;
  const postID = req.body.post_id;

  if(!userID || !postID) return res.status(400).json({error: 'Falta el id del usuario o el id del post'});

  try {
    const resultado = await funcionLikes(userID, postID);
    res.json(resultado)
  } catch (error) {
    res.status(500).json({error: 'Error en el toggle like'})
  }
})

router.post('/post_save', authenticateUser, async(req, res)=>{
  const userID = req.user.id;
  const postID = req.body.post_id;
  if(!userID || !postID) return res.status(400).json({error: 'Falta el id del usuario o el id del post'});
  try {
    const resultado = await funcionFavoritos(userID, postID)
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error en el toggle save'})
  }
})

router.post('/post_upload', authenticateUser, async(req, res)=>{
  const {author_id, title, content, media_url, etiquetas} = req.body;

  if(!author_id || !title || !content || !etiquetas) return res.status(400).json({error: 'Faltan datos'});

  if(typeof author_id !== 'string') return res.status(400).json({error: 'Falta el id del autor'});
  if(typeof title !== 'string') return res.status(400).json({error: 'Falta el título'});
  if(typeof content !== 'string') return res.status(400).json({error: 'Falta el contenido'});

  try {
    const resultado = await funcionSubirPost(author_id, title, content, media_url, etiquetas);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.post('/post-comment', authenticateUser, async(req, res)=>{
  const userID = req.user.id;
  const {post_id, content} = req.body;

  if(!post_id || !content) return res.status(400).json({error: 'Faltan datos'});

  try {
    const resultado = await crearComentario( post_id, userID, content);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.get('/post-comments', async(req, res)=>{
  const {post_id} = req.query;
  if(!post_id) res.status(400).json({error: 'Falta el post_id'});

  try {
    const resultado = await obtenerComentarios( post_id );
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.delete('/delete-post', authenticateUser, async(req, res)=>{
  const userID = req.user.id;
  const {post_id} = req.query;
  if(!userID) res.status(400).json({error: 'Falta el id del usuario'});
  if(!post_id) res.status(400).json({error: 'Falta el post_id'});

  try {
    const resultado = await borrarPublicacion( post_id, userID);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.get('/posts-etiquetas', async(req, res)=>{
  const {etiquetas} = req.query;
  try {
    const resultado = await obtenerPostsEtiquetas( etiquetas );
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.get('/buscar-posts', authenticateUser, async (req, res) => {
  const { q, usuario_id } = req.query;
  const usuarioIdSesion = req.user.id;

  if (!q) {
    return res.status(400).json({ error: 'Término de búsqueda requerido' });
  }

  try {
    const resultado = await buscarPublicaciones(q, usuario_id || usuarioIdSesion);
    res.json(resultado);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar publicaciones' });
  }
});

router.post('/report-post', authenticateUser, async (req, res) => {
  const userID = req.user.id;
  const { post_id } = req.body;

  if (!post_id) {
    return res.status(400).json({ error: 'post_id es requerido' });
  }

  try {
    const postIdInt = parseInt(post_id);
    if(isNaN(postIdInt)) return res.status(400).json({ error: 'post_id debe ser un número entero' });
    const resultado = await reportarPost(postIdInt, userID);
    res.json(resultado);
  } catch (error) {
    console.error('Error al reportar el post:', error);
    res.status(500).json({ error: 'Error al reportar el post' });
  }
});

router.get('/check-report', authenticateUser, async (req, res) => {
  const userID = req.user.id;
  const { post_id } = req.query;

  try {
    const result = await pool.query(
      'SELECT sp_check_user_reported($1, $2) as reported',
      [post_id, userID]
    );
    
    res.json({ reported: result.rows[0].reported });
  } catch (error) {
    console.error('Error verificando reporte:', error);
    res.status(500).json({ error: 'Error verificando reporte' });
  }
});

export default router;