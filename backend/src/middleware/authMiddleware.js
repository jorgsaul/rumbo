import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const cookieToken = req.cookies.token;
  if (cookieToken) {
    try {
      const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      // Token inválido, continuar con header
    }
  }
  
  // 2. Verificar header Authorization (Google OAuth)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      // Token inválido
    }
  }
  
  // 3. No autenticado
  return res.status(401).json({ error: 'No autenticado' });
};