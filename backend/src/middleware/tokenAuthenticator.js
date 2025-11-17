import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export function tokenAuthenticator(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }

}

export default tokenAuthenticator;