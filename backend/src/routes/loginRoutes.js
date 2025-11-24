import express from 'express';
import { iniciarSesion } from '../controllers/inicioSesion.js';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../config/dataBase.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  if(!token) return res.status(400).json({ error: 'Token de Google requerido' });
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const userResult = await pool.query(
      'SELECT * FROM _users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user;
    if(userResult.rows.length === 0) {
      const username = email.split('@')[0] + Math.random().toString(36).substring(2, 5);
      const newUser = await pool.query(
        `INSERT INTO _users (id, google_id, email, full_name, username, avatar_url, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
        [googleId, googleId, email, name, username, picture, 'user']);
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
      if(!user.google_id){
        await pool.query('UPDATE _users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
      }
    }

    const token = jwt.sign({ id: user.id, rol: user.role }, JWT_SECRET);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });
    res.json({
      success: true,
      user:{
        id: user,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        avatar_url: user.avatar_url,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión con Google' });
  }
});

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
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
    }

    return res.json(resultado);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;