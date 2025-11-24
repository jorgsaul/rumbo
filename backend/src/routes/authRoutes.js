import express from 'express';
import jwt from 'jsonwebtoken';
import { crearOActualizarUsuarioAuth0 } from '../middleware/authoUsers.js';

const router = express.Router();
// En authRoutes.js - AGREGA ESTO TEMPORALMENTE
router.get('/auth/debug-callback', (req, res) => {
  console.log('🎯 DEBUG CALLBACK EJECUTADO');
  console.log('📝 Query params:', req.query);
  console.log('🔍 User:', req.oidc?.user);
  console.log('🔍 Autenticado:', req.oidc?.isAuthenticated?.());
  
  res.json({
    message: 'Debug callback executed',
    query: req.query,
    authenticated: req.oidc?.isAuthenticated?.()
  });
});
router.get('/auth/success', async (req, res) => {
  try {
    console.log('🔄 Auth success ejecutado');
    
    if (!req.oidc?.isAuthenticated?.()) {
      return res.redirect('https://rumbo-iota.vercel.app/login?error=auth_failed');
    }

    console.log('✅ Usuario autenticado con Auth0');
    const user = await crearOActualizarUsuarioAuth0(req.oidc.user);
    
    // Crear TU cookie JWT (igual que login normal)
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
    console.error('❌ Error en auth success:', error);
    res.redirect('https://rumbo-iota.vercel.app/login?error=server_error');
  }
});

router.get('/auth/callback', async (req, res) => {
  try {
    console.log('🔄 CALLBACK DE AUTH0 EJECUTADO');
    console.log('🔍 User:', req.oidc?.user);
    console.log('🔍 Autenticado:', req.oidc?.isAuthenticated?.());
    
    if (!req.oidc?.isAuthenticated?.()) {
      return res.redirect('https://rumbo-iota.vercel.app/login?error=auth_failed');
    }

    console.log('✅ Usuario autenticado con Auth0');
    crearOActualizarUsuarioAuth0(req.oidc.user)
  .then((user) => {
    console.log('✅ Usuario procesado:', user.id);
    
    // ✅ Crear cookie JWT DIRECTAMENTE aquí
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

    // ✅ Cerrar sesión de Auth0
    req.oidc.logout();
    
    console.log('🍪 Cookie JWT creada, redirigiendo...');
    return res.redirect('https://rumbo-iota.vercel.app/foro');
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    return res.redirect('https://rumbo-iota.vercel.app/login?error=server_error');
  });

export default router;