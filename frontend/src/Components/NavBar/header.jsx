import "./header.css";
import logoImageHeader from "../img/Logo-blancoL-header.png";
import IconoBuscar from "../iconos/iconoBuscar";
import PopUpSearch from "../busquedas/popUp";
import { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";

function Header() {
  const [popUp, setPopUp] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [focus, setFocus] = useState(false);
  const [toggleFiltros, setToggleFiltros] = useState(false);
  const { selectedEtiquetas, handleCheckboxChange } = useFiltro();

  const handleChange = (e) => {
    setBusqueda(e.target.value);
    if (busqueda.length > 0) setPopUp(true);
    else setPopUp(false);
  };

  const handeBlur = () => {
    setTimeout(() => {
      setPopUp(false);
      setFocus(false);
      setBusqueda("");
    }, 200);
  };
  useEffect(() => {
    if (!focus) {
      setPopUp(false);
      setBusqueda("");
    }
  }, [focus]);

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
            onFocus={() => setFocus(true)}
            onBlur={handeBlur}
          />
          {popUp && focus ? <PopUpSearch busqueda={busqueda} /> : null}
        </div>
      </div>
      <div className="filtros-header">
        <button
          className="btn-filtros"
          onClick={() => setToggleFiltros(!toggleFiltros)}
        >
          Filtros
        </button>

        {toggleFiltros && (
          <div className="menu-filtros-header">
            <CascadeMenu
              showButton={false}
              selectedEtiquetas={selectedEtiquetas}
              handleCheckboxChange={handleCheckboxChange}
              filtro={true}
            />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
