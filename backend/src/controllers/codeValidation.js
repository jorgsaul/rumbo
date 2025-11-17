import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const enviarCodigo = async correo => {
  try {
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    
    const msg = {
      to: correo,
      from: process.env.EMAIL_FROM,
      subject: 'Código de verificación Rumbo',
      text: `Tu código es: ${codigo}`,
      html: `<h1>Código de verificación</h1><p>Tu código es: <b>${codigo}</b></p>`
    };

    await sgMail.send(msg);
    return codigo;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
  
}

export const validarCodigo = async (correo, codigo, entrada) => {
  const storedCode = entrada;
  if(codigo && storedCode === codigo){
    return true
  }
  return false
}