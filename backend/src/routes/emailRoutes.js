import { enviarCodigo } from '../controllers/codeValidation.js';

router.post('/enviarCorreo', async (req, res) => {
  const { correo } = req.body;

  try {
    const resultado = await enviarCodigo(correo);
    res.json(resultado);
  } catch (error) {
    console.log('💥 ERROR:', error.message);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});