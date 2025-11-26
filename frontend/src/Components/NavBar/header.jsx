import "./header.css";
import logoImageHeader from "../img/Logo-blancoL-header.png";
import IconoBuscar from "../iconos/iconoBuscar";
import PopUpSearch from "../busquedas/popUp";
import { useState } from "react";

function Header() {
  const [popUp, setPopUp] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const handleChange = (e) => {
    setBusqueda(e.target.value);
    if (busqueda.length > 0) setPopUp(true);
    else setPopUp(false);
  };

  return (
    <header className="rumbo-header">
      <img src={logoImageHeader} alt="" className="logo-image-header" />
      <div className="buscador-header">
        <div className="buscador-contenedor">
          <span className="icono-buscar-buscador">
            <IconoBuscar />
          </span>
          <input
            type="text"
            placeholder="Prueba buscando algo"
            onChange={handleChange}
          />
          {popUp && <PopUpSearch busqueda={busqueda} />}
        </div>
      </div>
    </header>
  );
}

export default Header;
