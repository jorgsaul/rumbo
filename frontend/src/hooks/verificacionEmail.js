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
    
    if (!emailRegex.test(emailToCheck.trim())) {
      return 'Correo electrónico no válido';
    }

    try {
      const correoExistente = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/validarCorreoExistente?correo=${encodeURIComponent(emailToCheck)}`, 
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      const data = await correoExistente.json();
      console.log("📧 Validación de correo:", data);
      
      if (esRegistro) {
        if (data.existe) {
          return "El correo ya tiene una cuenta asociada";
        }
      } else {
        if (!data.existe) {
          return "El correo no está registrado en el sistema";
        }
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