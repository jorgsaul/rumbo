import { useEffect, useState } from "react";
import "./busquedas.css";
function PopUpSearch({ busqueda }) {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  useEffect(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/buscar-perfil?entrada=${busqueda}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      setListaUsuarios(data || []);
    } catch (e) {
      console.log(e);
    }
  }, [busqueda]);
  return (
    <div className="contenedor-popUp">
      <h1>Perfiles</h1>
      {listaUsuarios.map((perfil) => {
        return <CardOpciones perfil={perfil} />;
      }) || "No se encontraron perfiles"}
      <h1>Publicaciones</h1>
      <p>Todo para publicaciones</p>
    </div>
  );
}

export default PopUpSearch;
