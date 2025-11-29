import { enviarCodigo } from '../controllers/codeValidation.js';

router.post('/enviarCorreo', async (req, res) => {
  const { correo } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correo || typeof correo !== 'string') return res.status(400).json({ error: 'Falta el correo' });
  if(correo.length > 254) return res.status(400).json({ error: 'El correo es demasiado largo' });
  if(!emailRegex.test(correo.trim())) return res.status(400).json({ error: 'Correo no valido' });

  try {
    const resultado = await enviarCodigo(correo);
    res.json(resultado);
  } catch (error) {
    console.log('💥 ERROR:', error.message);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});