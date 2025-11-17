import { useState, useEffect } from 'react';

export const useObtencionUsuario = () => {
const [perfil, setDatosPerfil] = useState({})
  
  const datosPerfil = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/perfil`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los datos del perfil:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchDatosPerfil = async () => {
      const datos = await datosPerfil();
      if (datos) {
        setDatosPerfil(datos);
      }
    };
    fetchDatosPerfil();
  }, []);
  
  return { perfil };
}

export const useObtencionUsuarioExterno = (usuarioId) => {
const [perfil, setDatosPerfil] = useState({})
  const datosPerfil = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/perfil-externo?usuarioExternoId=${usuarioId}`)
      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los datos del perfil:', error);
      return null;
    }
  }

  useEffect(() => {
    if(!usuarioId) return;
    const fetchDatosPerfil = async () => {
      const datos = await datosPerfil();
      if (datos) {
        setDatosPerfil(datos);
      }
    };
    fetchDatosPerfil();
  }, [usuarioId]);
  
  return { perfil };
}