import "./busquedas.css";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import { Link } from "react-router-dom";
function CardOpciones({ perfil }) {
  return (
    <Link to={`/perfil/${perfil.id}`} className="card-opciones">
      <div className="contenedor-avatar-opciones">
        <div className="contenedor-imagen-avatar-opciones">
          <AvatarPublicacion urlImagen={perfil.avatar_url} />
        </div>
      </div>
      <div className="contenedor-datos-opciones">
        <div className="usuario-opciones">
          <p>{perfil.full_name}</p>
          <b>@{perfil.username}</b>
        </div>
      </div>
    </Link>
  );
}

export default CardOpciones;
