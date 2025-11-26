import "./ventanaComentarios.css";
import CardComentario from "../cards/cardComentario";
import InputInvisible from "../forms/inputInvisible";
import IconoEnviar from "../iconos/iconoEnviar";
import { useEffect, useState } from "react";
function VentanaComentarios({
  idPublicacion,
  showComentarios,
  setShowComentarios,
}) {
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [exito, setExito] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  const obtenerComentarios = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/post-comments?post_id=${idPublicacion}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error en la respuesta de la red");
      }
      const data = await response.json();
      setComentarios(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, [showComentarios]);

  const handleContinuar = async () => {
    if (!comentario) {
      setError(true);
      setMessage("El comentario no puede estar vacio");
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/post-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: comentario, post_id: idPublicacion }),
        }
      );

      if (!response) throw new Error("Error en la respuesta de red");

      setComentario("");
      setError(false);
      setMessage("");
      setExito(true);
      document.getElementById("comentario").value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setError(false);
    setMessage("");
    setComentario(e.target.value);
  };

  useEffect(() => {
    if (exito) {
      obtenerComentarios();
      setExito(false);
    }
  }, [exito]);

  useEffect(() => {
    if (showComentarios && idPublicacion) {
      obtenerComentarios();
    }
  }, [showComentarios, idPublicacion]);

  return (
    <div className="contenedor-ventana-comentarios">
      <div className="contenedor-comentarios">
        {comentarios.length === 0 ? (
          <p style={{ marginTop: "1rem", color: "#1f1f1f" }}>
            Se el primero en comentar
          </p>
        ) : (
          [...comentarios]
            .reverse()
            .map((comentario) => (
              <CardComentario key={comentario.id} objeto={comentario} />
            ))
        )}
      </div>
      <div className="contenedor-crear-comentario">
        <InputInvisible
          holder={"Agrega un comentario"}
          className={"input-crear-comentario"}
          onChange={handleChange}
          maxLength={280}
          error={error}
          errorMessage={message}
          value={comentario}
          id={"comentario"}
        />{" "}
        <div className="contenedor-icono-imagen">
          <IconoEnviar funcion={handleContinuar} />
        </div>
      </div>
    </div>
  );
}

export default VentanaComentarios;
