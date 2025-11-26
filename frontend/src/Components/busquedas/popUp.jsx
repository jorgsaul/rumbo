import { useEffect, useState } from "react";
import CardOpciones from "./cardOpciones";
import "./busquedas.css";
function PopUpSearch({ busqueda }) {
  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(...);
        const data = await response.json();
        setListaUsuarios(data || []);
      } catch (e) {
        console.log(e);
      }
    };
    
    if (busqueda.trim() !== "") {
      fetchData();
    } else {
      setListaUsuarios([]);
    }
  }, [busqueda]);
  
  return (
    <div className="contenedor-popUp">
      <h1>Perfiles</h1>
      {listaUsuarios.map((perfil) => {
        return <CardOpciones key={perfil.id} perfil={perfil} />;
      }) || "No se encontraron perfiles"}
      <h1>Publicaciones</h1>
      <p>Todo para publicaciones</p>
    </div>
  );
}

export default PopUpSearch;
