import CardPublicacion from "../cards/cardPublicacion";
import { useParams } from "react-router-dom";

function VentanaResultados() {
  const { busqueda } = useParams();

  return (
    <div>
      <p>Ventana de resultados</p>
      <p>Busqueda: {busqueda}</p>
    </div>
  );
}

export default VentanaResultados;
