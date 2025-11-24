import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  console.log('🔍 MIDDLEWARE - Ruta:', req.path);
  console.log('🔍 Cookies recibidas:', Object.keys(req.cookies));
  console.log('🔍 Authorization header:', req.headers.authorization);
  
  const cookieToken = req.cookies.token;
  if (cookieToken) {
    console.log('🔍 Cookie token encontrado');
    try {
      const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
      console.log('✅ Usuario autenticado por cookie:', decoded.id);
      req.user = decoded;
      return next();
    } catch (error) {
      console.log('❌ Cookie token inválido');
    }
  }
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('🔍 Header token encontrado');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Usuario autenticado por header:', decoded.id);
      req.user = decoded;
      return next();
    } catch (error) {
      console.log('❌ Header token inválido');
    }
  }
  
  console.log('❌ No se encontró token válido');
  return res.status(401).json({ error: 'No autenticado' });
};