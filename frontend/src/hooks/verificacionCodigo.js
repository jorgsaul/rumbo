import { useState } from 'react';
import axios from 'axios';

export function useCodeVerification() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validarCodigo = (codigo) => {
    return codigo.length === 4;
  };

  const verificarCodigo = async (correo, codigoEnviado, codigoIngresado) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/validarCodigo`, {
        correo: correo,
        codigo: codigoEnviado,
        entrada: codigoIngresado
      });
      
      return res.data.message === 'Codigo correcto';
    } catch (error) {
      console.error('Error al verificar código:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCodigoChange = (value) => {
    setCodigo(value);
    if (error) setError(false);
  };

  return {
    codigo,
    setCodigo,
    error,
    setError,
    loading,
    setLoading,
    validarCodigo,
    verificarCodigo,
    handleCodigoChange
  };
}