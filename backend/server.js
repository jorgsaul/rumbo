import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';

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

dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  'https://rumbo-jorgsauls-projects.vercel.app',
  'https://rumbo-iota.vercel.app'
]

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

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


app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  if(!res.headersSent){
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
