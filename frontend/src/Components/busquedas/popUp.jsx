import { useEffect, useState } from "react";
import CardOpciones from "./cardOpciones";
import { Link } from "react-router-dom";
import "./busquedas.css";
function PopUpSearch({ busqueda }) {
  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/buscar-perfil?entrada=${busqueda}`,
          { method: "GET", credentials: "include" }
        );
        const data = await response.json();
        setListaUsuarios(data || []);
      } catch (e) {
        console.log("Error:", e);
        setListaUsuarios([]);
      }
    };

    if (busqueda.trim() !== "") {
      fetchUsuarios();
    } else {
      setListaUsuarios([]);
    }
  }, [busqueda]);

  return (
    <div className="contenedor-popUp">
      <h1>Perfiles</h1>
      {listaUsuarios.length > 0 ? (
        listaUsuarios.map((perfil) => (
          <CardOpciones key={perfil.id} perfil={perfil} />
        ))
      ) : (
        <p>No se encontraron perfiles</p>
      )}
      <h1>Publicaciones</h1>
      <Link to={`/busqueda/${busqueda}`} className="card-opcion-busqueda">
        <p>Prueba buscando "{busqueda}" en Publicaciones</p>
      </Link>
    </div>
  );
}

export default PopUpSearch;
