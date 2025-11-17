import { enviarCodigo } from '../controllers/codeValidation.js';

router.post('/enviarCorreo', async (req, res) => {
  console.log('🔴 LLEGÓ PETICIÓN /enviarCorreo');
  const { correo } = req.body;
  console.log('📧 Correo recibido:', correo);

  try {
    const resultado = await enviarCodigo(correo);
    res.json(resultado);
  } catch (error) {
    console.log('💥 ERROR:', error.message);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});