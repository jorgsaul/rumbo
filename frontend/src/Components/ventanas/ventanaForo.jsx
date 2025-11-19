import "./ventanaForo.css";
import CardPublicacion from "../cards/cardPublicacion";
import CardNuevaPublicacion from "../cards/cardNuevaPublicacion.jsx";
import IconoFiltro from "../iconos/iconoFiltro.jsx";
import CascadeMenu from "../forms/cascadeMenu.jsx";
import { useEffect, useState } from "react";
import { useObtencionUsuario } from "../../hooks/obtencionUsuario.js";
import { useParams } from "react-router-dom";

function VentanaForo({ ventanaActual }) {
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [toggle, setToggle] = useState(false);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState({});
  const { perfil } = useObtencionUsuario();
  const { idUsuario } = useParams();

  function cambioFiltro(ventana) {
    switch (ventana) {
      case "publicaciones":
        setFiltro("publicaciones_propias");
        break;
      case "megusta":
        setFiltro("likes");
        break;
      case "comentarios":
        setFiltro("comentarios");
        break;
      case "favoritos":
        setFiltro("favoritos");
        break;
      default:
        setFiltro("todos");
        break;
    }
  }

  const handleCheckboxChange = (categoryId, tagId) => {
    setSelectedEtiquetas((prev) => {
      const currentCategory = prev[categoryId] || [];
      const isSelected = currentCategory.includes(tagId);

      if (isSelected) {
        const updatedCategory = currentCategory.filter((id) => id !== tagId);
        const newState = {
          ...prev,
          [categoryId]: updatedCategory,
        };
        if (updatedCategory.length === 0) {
          delete newState[categoryId];
        }
        return newState;
      } else {
        return {
          ...prev,
          [categoryId]: [...currentCategory, tagId],
        };
      }
    });
  };

  const obtenerIdsEtiquetas = () => {
    return Object.values(selectedEtiquetas).flat();
  };

  useEffect(() => {
    const ids = obtenerIdsEtiquetas();

    if (ids.length > 0) {
      obtenerPostsEtiquetas(ids.join(","));
    } else {
      obtenerPosts();
    }
  }, [selectedEtiquetas]);

  useEffect(() => {
    cambioFiltro(ventanaActual);
  }, [ventanaActual]);

  const obtenerPosts = async () => {
    if (!perfil.id) return;
    const idUsuarioPerfil = idUsuario || perfil.id;

    try {
      let url = `${import.meta.env.VITE_APP_API_BASE_URL}/posts`;
      if (filtro)
        url += `?filtro=${filtro}&usuario_id_perfil=${idUsuarioPerfil}&usuario_id_sesion=${perfil.id}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error en la respuesta de la red");

      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
    }
  };

  const obtenerPostsEtiquetas = async (etiquetas) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/posts-etiquetas?etiquetas=${etiquetas}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Error en la respuesta de la red");

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error al obtener los posts por etiqueta:", error);
    }
  };

  useEffect(() => {
    obtenerPosts();
  }, [filtro, perfil, idUsuario]);

  return (
    <div className="contenedor-ventana-foro">
      <div className="contenedor-lista-foros">
        {filtro === "todos" && (
          <CardNuevaPublicacion
            usuario={perfil}
            onPostSuccess={async () => {
              await obtenerPosts();
            }}
          />
        )}

        {posts.length > 0 ? (
          [...posts]
            .reverse()
            .map((post) => (
              <CardPublicacion
                recargarPublicaciones={obtenerPosts}
                key={post.id}
                objeto={post}
                publicacionPropia={post.author_id === perfil.id}
              />
            ))
        ) : (
          <p>Sin publicaciones</p>
        )}
      </div>
      {filtro === "todos" && (
        <div className="contenedor-filtros">
          <div className="contenedor-filtros-cascade-menu">
            {toggle && (
              <CascadeMenu
                showButton={false}
                selectedEtiquetas={selectedEtiquetas}
                handleCheckboxChange={handleCheckboxChange}
              />
            )}
          </div>
          <IconoFiltro funcion={() => setToggle(!toggle)} />
        </div>
      )}
    </div>
  );
}

export default VentanaForo;
