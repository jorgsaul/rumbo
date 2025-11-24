import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';

import { authMiddleware } from './src/config/auth.js';
import postsRoutes from './src/routes/postsRoutes.js';
import loginRoutes from './src/routes/loginRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import cookiesRoutes from './src/routes/cookiesRoutes.js';
import cloudinaryRoute from './src/routes/cloudinary.js';
import cloudinary from 'cloudinary';
import codigoRoutes from './src/routes/codigoRoutes.js';
import signInRoutes from './src/routes/signInRoutes.js';
import cambiarContrasena from './src/routes/routeCambioContraseña.js';
import obtenerEtiquetas from './src/routes/etiquetasRoutes.js';
import authRoutes from './src/routes/authRoutes.js'
import { crearOActualizarUsuarioAuth0 } from './src/middleware/authoUsers.js';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rumbo-ffau3m0gd-jorgsauls-projects.vercel.app',
    'https://rumbo-autga3imr-jorgsauls-projects.vercel.app',
    'https://rumbo-jorgsauls-projects.vercel.app',
    'https://rumbo-iota.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(authMiddleware);
app.use((req, res, next) => {
  console.log('🔍 REQUEST:', req.method, req.url);
  console.log('🔍 AUTH0 isAuthenticated:', req.oidc?.isAuthenticated?.());
  
  if (req.oidc?.isAuthenticated?.() && req.url === '/') {
    console.log('🎯 AUTH0 REDIRIGIÓ A RAÍZ - Creando cookie...');
    console.log('👤 User:', req.oidc?.user);
    
    crearOActualizarUsuarioAuth0(req.oidc.user)
      .then((user) => {
        console.log('✅ Usuario procesado:', user.id);
        
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

        req.oidc.logout();
        
        console.log('🍪 Cookie JWT creada, redirigiendo...');
        return res.redirect('https://rumbo-iota.vercel.app/foro');
      })
      .catch((error) => {
        console.error('❌ Error al crear o actualizar usuario con Auth0:', error);
        return res.redirect('https://rumbo-iota.vercel.app/login?error=auth_failed');
      });
  } else {
    next();
  }
});

function sanitizeAllStrings(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      obj[key] = sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} }).trim();
    } else if (typeof val === 'object') {
      sanitizeAllStrings(val);
    }
  }
}

app.use((req, res, next) => {
  sanitizeAllStrings(req.body);
  sanitizeAllStrings(req.query);
  sanitizeAllStrings(req.params);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
});

app.use('/', postsRoutes);
app.use('/', loginRoutes);
app.use('/', userRoutes);
app.use('/', cookiesRoutes);
app.use('/', cloudinaryRoute);
app.use('/', codigoRoutes);
app.use('/', signInRoutes);
app.use('/', cambiarContrasena);
app.use('/', obtenerEtiquetas);
app.use('/', authRoutes);

app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  if(!res.headersSent){
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
