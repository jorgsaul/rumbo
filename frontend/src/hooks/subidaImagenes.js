import { useState, useRef } from 'react';

export function useSubidaImagen() {
  const fileInputRef = useRef(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const abrirSelectorImagen = () => {
    fileInputRef.current?.click();
  };

  const manejarCambioImagen = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setSubiendoImagen(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImagenSeleccionada(data.secure_url || data.url);
    } catch (err) {
      console.error('Error subiendo la imagen:', err);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const limpiarImagen = () => {
    setImagenSeleccionada(null);
    setPreview(null);
    setSubiendoImagen(false);
  };

  return {
    fileInputRef,
    imagenSeleccionada,
    preview,
    subiendoImagen,
    abrirSelectorImagen,
    manejarCambioImagen,
    limpiarImagen,
  };
}
