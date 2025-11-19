import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.get('/authenticate', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ loggedIn: true });
  } catch (error) {
    return res.json({ loggedIn: false });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token',{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
  return res.json({ success: true, message: 'Logged out successfully' });
});
export default router;