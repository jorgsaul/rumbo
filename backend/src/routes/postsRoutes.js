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

const router = express.Router();

router.get('/posts', authenticateUser, async (req, res) => {
  const filtro = req.query.filtro;
  const usuarioIdPerfil = req.query.usuario_id_perfil;
  const usuarioIdSesion = req.user.id;
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

  try {
    const resultado = await funcionFavoritos(userID, postID)
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error en el toggle save'})
  }
})

router.post('/post_upload', authenticateUser, async(req, res)=>{
  const {author_id, title, content, media_url, etiquetas} = req.body;
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
  try {
    const resultado = await crearComentario( post_id, userID, content);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({error: 'Error al subir el post'})
  }
})

router.get('/post-comments', async(req, res)=>{
  const {post_id} = req.query;
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

export default router;