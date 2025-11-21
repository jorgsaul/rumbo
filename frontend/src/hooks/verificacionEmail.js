import { useState } from 'react';
import axios from 'axios';

export function useEmailVerification(initialEmail = '', esRegistro) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState('');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarEmail = async (emailToValidate) => {
    const emailToCheck = emailToValidate || email;
    console.log("🟡🟡🟡 VALIDAR EMAIL - INICIO 🟡🟡🟡");
    console.log("📧 Email a validar:", emailToCheck);
    console.log("🎯 Es registro:", esRegistro);
    if (!emailRegex.test(emailToCheck.trim())) {
      return 'Correo electrónico no válido';
    }

    try {
      console.log("🌐 Haciendo fetch a validarCorreoExistente...");
      const correoExistente = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/validarCorreoExistente?correo=${encodeURIComponent(emailToCheck)}`, 
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log("📡 Status response:", correoExistente.status);
      
      const data = await correoExistente.json();
      console.log("📊 Data completa:", data);
      console.log("🔍 data.existe:", data.existe);
      console.log("🔍 Tipo de data.existe:", typeof data.existe);
      
      if (!esRegistro && !data.existe) {
        return "El correo no está registrado en el sistema";
      }
    
      if (esRegistro && data.existe) {
        return "El correo ya tiene una cuenta asociada";
      }
      
    } catch (error) {
      console.error("Error en validarEmail:", error);
      return "Error al validar el correo";
    }
    
    return "";
  };

  const enviarCodigo = async (email) => {
    setLoading(true);
    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/enviarCorreo`, 
        { correo: email }
      );
      setCodigo(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error("Error en enviarCodigo:", error);
      throw new Error('Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (error) setError(false);
    if (mensaje) setMensaje('');
  };

  return {
    email,
    setEmail,
    error,
    setError,
    mensaje,
    setMensaje,
    loading,
    setLoading,
    codigo,
    setCodigo,
    validarEmail,
    enviarCodigo,
    handleEmailChange
  };
}