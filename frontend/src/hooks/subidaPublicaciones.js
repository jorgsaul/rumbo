import { useState } from 'react';
import { useSubidaImagen } from './subidaImagenes';

export function useNuevaPublicacion(usuario) {
  const {
    fileInputRef,
    imagenSeleccionada,
    preview,
    subiendoImagen,
    abrirSelectorImagen,
    manejarCambioImagen,
    limpiarImagen
  } = useSubidaImagen();

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [selectedEtiquetas, setSelectedEtiquetas] = useState({});

  const handlePostClick = async () => {
    if (!titulo.trim() || !contenido.trim()) return;

    if (subiendoImagen) {
      alert('La imagen todavía se está subiendo. Espera un momento.');
      return;
    }

    const datos = {
      title: titulo.trim(),
      content: contenido.trim(),
      author_id: usuario.id,
      media_url: imagenSeleccionada,
      etiquetas: Object.values(selectedEtiquetas).flat(),
    };
    console.log('📡 Datos a enviar:', datos);
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/post_upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        credentials: 'include',
      });

      if (!respuesta.ok) throw new Error('Error en la respuesta de red');

      const data = await respuesta.json();
      if (data.success) window.location.reload();
    } catch (error) {
      console.error('Error al subir la publicación:', error);
    }

    return datos;
  };

  const handleCheckboxChange = (categoriaId, etiquetaId, limite = 4) => {
    setSelectedEtiquetas(prev => {
      const actuales = prev[categoriaId] || [];

      if (actuales.includes(etiquetaId)) {
        return { ...prev, [categoriaId]: actuales.filter(id => id !== etiquetaId) };
      } else {
        if (actuales.length >= limite) return prev;
        return { ...prev, [categoriaId]: [...actuales, etiquetaId] };
      }
    });
  };

  const totalEtiquetasSeleccionadas = Object.values(selectedEtiquetas).reduce(
    (total, etiquetas) => total + etiquetas.length,
    0
  );

  const canPost = !!titulo.trim() && !!contenido.trim() && !subiendoImagen && totalEtiquetasSeleccionadas > 0;

  const limpiarCampos = () => {
    limpiarImagen();
    setTitulo('');
    setContenido('');
    setSelectedEtiquetas({});
  };

  return {
    fileInputRef,
    imagenSeleccionada,
    preview,
    subiendoImagen,
    abrirSelectorImagen,
    manejarCambioImagen,
    titulo,
    contenido,
    setTitulo,
    setContenido,
    handlePostClick,
    canPost,
    limpiarCampos,
    selectedEtiquetas,
    handleCheckboxChange
  };
}
