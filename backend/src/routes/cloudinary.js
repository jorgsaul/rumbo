import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/upload-image', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

export default router;