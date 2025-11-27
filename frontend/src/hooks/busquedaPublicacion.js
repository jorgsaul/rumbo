import { useState } from 'react';

export function useBusqueda() {
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const buscarPublicaciones = async (termino, usuarioId = null) => {
    if (!termino.trim()) {
      setResultados([]);
      return;
    }

    setBuscando(true);
    try {
      const params = new URLSearchParams({ q: termino });
      if (usuarioId) params.append('usuario_id', usuarioId);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/buscar-posts?${params}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Error en la búsqueda');

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error('Error buscando publicaciones:', error);
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setResultados([]);
  };

  return {
    resultados,
    buscando,
    buscarPublicaciones,
    limpiarBusqueda
  };
}