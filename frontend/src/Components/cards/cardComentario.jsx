import "./cardComentario.css";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import IconoEyeSlash from "../iconos/iconoEyeSlash";
import { useState } from "react";

function CardComentario({ objeto }) {
  const [estaOculto, setEstaOculto] = useState(false);

  useState(() => {
    const estaOcultoEnStorage = localStorage.getItem(
      `comentario_oculto_${objeto.id}`
    );
    if (estaOcultoEnStorage === "true") {
      setEstaOculto(true);
    }
  }, []);

  const toggleOcultar = () => {
    const nuevoEstado = !estaOculto;
    setEstaOculto(nuevoEstado);

    if (nuevoEstado) {
      localStorage.setItem(`comentario_oculto_${objeto.id}`, "true");
    } else {
      localStorage.removeItem(`comentario_oculto_${objeto.id}`);
    }
  };

  if (estaOculto) {
    return (
      <div className="comentario-oculto" onClick={toggleOcultar}>
        <IconoEyeSlash />
        <span>Comentario oculto - Click para mostrar</span>
      </div>
    );
  }

  return (
    <div className="contenedor-card-comentario">
      <button
        className="btn-ocultar-comentario"
        onClick={toggleOcultar}
        title="Ocultar comentario"
      >
        <IconoEyeSlash />
      </button>

      <div className="contenedor-avatar-comentario">
        <div className="contenedor-imagen-avatar-comentario">
          <AvatarPublicacion urlImagen={objeto.avatar_url} />
        </div>
      </div>

      <div className="contenedor-datos-comentario">
        <div className="usuario-comentario">
          <p>{objeto.full_name}</p>
          <b>@{objeto.username}</b>
        </div>
        <div className="texto-comentario">
          <p>{objeto.content}</p>
        </div>
      </div>
    </div>
  );
}

export default CardComentario;
