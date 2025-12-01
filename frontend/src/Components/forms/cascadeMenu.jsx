import ButtonOutline from "../botones/buttonOutline";
import Checkbox from "./checkbox";
import { useState, useEffect } from "react";
import "./cascadeMenu.css";

export default function CascadeMenu({
  selectedEtiquetas,
  handleCheckboxChange,
  showButton = true,
  buttonText = "Etiquetas",
  filtro = false,
}) {
  const [toggle, setToggle] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    obtenerEtiquetas();
  }, []);

  const obtenerEtiquetas = async () => {
    try {
      const resultado = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/etiquetas`
      );
      const data = await resultado.json();
      setEtiquetas(data);
    } catch (error) {
      console.error("Error al obtener las etiquetas:", error);
    }
  };

  return (
    <div className="contenedor-cascade-menu">
      {showButton && (
        <ButtonOutline
          enable={true}
          text={`${buttonText} ${!toggle ? "▹" : "▿"}`}
          className={`boton-etiquetas ${toggle ? "active" : ""}`}
          funcion={handleToggle}
        />
      )}

      {(toggle || !showButton) && (
        <div
          className="cascade-menu"
          style={filtro ? { top: "-80px", left: "-30px" } : {}}
        >
          {etiquetas.map((categoria) => (
            <div key={categoria.category_id}>
              <p
                style={{ color: categoria.category_color, fontWeight: "bold" }}
              >
                {categoria.category_name}
              </p>
              {categoria.etiquetas.map((etiqueta) => (
                <Checkbox
                  text={etiqueta.name}
                  key={etiqueta.id}
                  color={categoria.category_color}
                  checked={
                    selectedEtiquetas[categoria.category_id]?.includes(
                      etiqueta.id
                    ) || false
                  }
                  accion={() =>
                    handleCheckboxChange(categoria.category_id, etiqueta.id)
                  }
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
