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
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);

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
    const todasEtiquetas = Object.values(prev).flat();
    
    // Si ya está seleccionada, quitarla
    if (todasEtiquetas.includes(etiquetaId)) {
      const nuevasEtiquetas = { ...prev };
      Object.keys(nuevasEtiquetas).forEach(catId => {
        nuevasEtiquetas[catId] = nuevasEtiquetas[catId].filter(id => id !== etiquetaId);
        if (nuevasEtiquetas[catId].length === 0) {
          delete nuevasEtiquetas[catId];
        }
      });
      return nuevasEtiquetas;
    } 
    // Si no está seleccionada y hay espacio, agregarla
    else if (todasEtiquetas.length < limite) {
      const actuales = prev[categoriaId] || [];
      return { 
        ...prev, 
        [categoriaId]: [...actuales, etiquetaId] 
      };
    }
    // Si ya se alcanzó el límite
    return prev;
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
