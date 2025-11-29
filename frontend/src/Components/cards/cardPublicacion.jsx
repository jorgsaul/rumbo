import "./cardPublicacion.css";
import AvatarPublicacion from "../avatar/avatarPublicacion";
import IconoLike from "../iconos/iconoLike";
import IconBookmark from "../iconos/iconoBookmark";
import IconoReport from "../iconos/iconoReport";
import IconoComentario from "../iconos/iconoComentario";
import VentanaComentarios from "../ventanas/ventanaComentarios";
import IconoBorrar from "../iconos/iconoBorrar";
import Tag from "../avatar/tag";
import VentanaAviso from "../ventanas/ventanaAviso";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CardPublicacion({ objeto, publicacionPropia, recargarPublicaciones }) {
  const [comentario, setComentario] = useState(false);
  const [aviso, setAviso] = useState(false);
  const [yaReportado, setYaReportado] = useState(false);

  useEffect(() => {
    const verificarReporte = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/check-report?post_id=${
            objeto.id
          }`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log(data.reported);
        setYaReportado(data.reported);
      } catch (error) {
        console.log(error);
      }
    };

    verificarReporte();
  }, [objeto.id]);

  const funcionReportar = async () => {
    if (yaReportado) return alert("Ya has reportado esta publicacion");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/report-post`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: objeto.id }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setYaReportado(true);
        alert(result.message);
        if (result.hidden) {
          recargarPublicaciones();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const funcionBorrar = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/delete-post?post_id=${
          objeto.id
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al borrar la publicación");
      }

      const result = await response.json();

      if (result.success) {
        recargarPublicaciones();
        setAviso(false);
      } else {
        alert("Error al borrar la publicación");
      }
    } catch (error) {
      console.error("Error borrando publicación:", error);
      alert("Error al borrar la publicación");
    }
  };

  return (
    <div className="card">
      {aviso && (
        <VentanaAviso
          mensaje={
            "¿Estas seguro que quieres borrar esta publicacion? Esta accion no se puede deshacer."
          }
          setAviso={setAviso}
          funcionAceptar={funcionBorrar}
        />
      )}
      <div className="avatar-container">
        <div className="img-avatar-container">
          <AvatarPublicacion
            urlImagen={objeto.author_image}
          ></AvatarPublicacion>
        </div>
      </div>
      <div className="publicacion">
        <div className="profile-user">
          <Link to={`/perfil/${objeto.author_id}`} className="link-usuario">
            <div className="nombre-usuario">{objeto.author_full_name}</div>
            <div className="Usuario">@{objeto.author_username}</div>
          </Link>
        </div>
        <div>
          <h4>{objeto.title}</h4>

          <p>{objeto.content}</p>
        </div>

        {objeto.media_url && (
          <div className="contenedor-multimedia">
            <img src={objeto.media_url} alt="" />
          </div>
        )}

        <div className="reacciones-publicacion">
          <div className="reaccion-like">
            <IconoLike
              postId={objeto.id}
              initialLiked={objeto.liked_by_user == 1}
              initialCount={objeto.likes_count}
            />
          </div>
          <div className="reaccion-guardar">
            <IconBookmark
              postId={objeto.id}
              alreadySaved={objeto.favorited_by_user == 1}
            />
          </div>
          <div className="reaccion-reportar">
            <IconoReport onClick={funcionReportar} yaReportado={yaReportado} />
          </div>
          <div className="reaccion-comentar">
            <IconoComentario funcion={() => setComentario(!comentario)} />
          </div>
        </div>
        <div className="tags-container">
          {objeto.tags.map((tag) => {
            return (
              <Tag
                key={objeto.tags.indexOf(tag)}
                tag={tag.text}
                color={tag.color}
              />
            );
          })}
        </div>
        {publicacionPropia && <IconoBorrar funcion={() => setAviso(true)} />}
        {comentario && (
          <VentanaComentarios
            idPublicacion={objeto.id}
            showComentarios={comentario}
            setShowComentarios={setComentario}
          />
        )}
      </div>
    </div>
  );
}

export default CardPublicacion;
