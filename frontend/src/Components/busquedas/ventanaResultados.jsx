import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardPublicacion from "../cards/cardPublicacion";
import { useObtencionUsuario } from "../../hooks/obtencionUsuario";
import "./ventanaResultados.css";

function VentanaResultados() {
  const { busqueda } = useParams();
  const { perfil } = useObtencionUsuario();
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    buscarResultados();
  }, [busqueda]);

  const buscarResultados = async () => {
    if (!busqueda) return;

    setCargando(true);
    setError(null);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/buscar-posts?q=${encodeURIComponent(busqueda)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error en la búsqueda");

      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error buscando publicaciones:", error);
      setError("No se pudieron cargar los resultados");
    } finally {
      setCargando(false);
    }
  };

  const recargarResultados = () => {
    buscarResultados();
  };

  if (cargando) {
    return (
      <div className="contenedor-ventana-foro">
        <div className="contenedor-lista-foros">
          <div className="cargando-resultados">
            <div className="spinner"></div>
            <p>Buscando "{busqueda}"...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor-ventana-foro">
      <div className="contenedor-lista-foros">
        <div className="cabecera-resultados">
          <h1 className="titulo-resultados">Resultados de búsqueda</h1>
          <div className="info-busqueda">
            <span className="termino-busqueda">"{busqueda}"</span>
            <span className="contador-resultados">
              {resultados.length}{" "}
              {resultados.length === 1 ? "resultado" : "resultados"} encontrados
            </span>
          </div>
        </div>

        {error && (
          <div className="error-busqueda">
            <p>{error}</p>
            <button onClick={buscarResultados} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        )}

        {!error && resultados.length === 0 ? (
          <div className="sin-resultados">
            <div className="icono-sin-resultados">🔍</div>
            <h2>No se encontraron resultados</h2>
            <p>No hay publicaciones que coincidan con "{busqueda}"</p>
            <ul className="sugerencias">
              <li>Revisa la ortografía</li>
              <li>Prueba con términos más generales</li>
              <li>Busca por autor, título o etiquetas</li>
            </ul>
          </div>
        ) : (
          <div className="lista-resultados">
            {resultados.map((publicacion) => (
              <CardPublicacion
                key={publicacion.id}
                objeto={publicacion}
                publicacionPropia={publicacion.author_id === perfil.id}
                recargarPublicaciones={recargarResultados}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VentanaResultados;
