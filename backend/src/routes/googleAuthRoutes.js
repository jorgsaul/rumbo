import express from 'express';
import jwt from 'jsonwebtoken';
import { crearOActualizarUsuarioAuth0 } from '../middleware/authoUsers.js';

const router = express.Router();

router.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=profile email` +
    `&access_type=offline` +
    `&prompt=consent`;
  
  console.log('🔗 Redirigiendo a Google OAuth');
  res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('https://rumbo-iota.vercel.app/login?error=no_code');
    }

    console.log('🔄 Intercambiando code por token...');
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('No se pudo obtener access token');
    }

    console.log('✅ Token obtenido, obteniendo datos de usuario...');
    
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json();
    
    console.log('👤 Usuario de Google:', googleUser.email);
    
    const user = await crearOActualizarUsuarioAuth0({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      sub: `google-${googleUser.id}`
    });

    const token = jwt.sign({ 
      id: user.id, 
      rol: user.role 
    }, process.env.JWT_SECRET);

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('🍪 Cookie JWT creada, redirigiendo...');
    res.redirect('https://rumbo-iota.vercel.app/foro');
    
  } catch (error) {
    console.error('❌ Error en Google OAuth:', error);
    res.redirect('https://rumbo-iota.vercel.app/login?error=auth_failed');
  }
});

export default router;