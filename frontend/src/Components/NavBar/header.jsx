import "./header.css";
import logoImageHeader from "../img/Logo-blancoL-header.png";
import IconoBuscar from "../iconos/iconoBuscar";
import PopUpSearch from "../busquedas/popUp";
import CascadeMenu from "../forms/cascadeMenu";
import { useEffect, useState } from "react";
import { useFiltro } from "../context/FiltroContext";

function Header() {
  const [popUp, setPopUp] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [focus, setFocus] = useState(false);
  const [toggleFiltros, setToggleFiltros] = useState(false);
  const { selectedEtiquetas, handleCheckboxChange, obtenerIdsEtiquetas } =
    useFiltro();

  const filtrosActivos = obtenerIdsEtiquetas().length;

  const handleChange = (e) => {
    const value = e.target.value;
    setBusqueda(value);
    if (value.length > 0) setPopUp(true);
    else setPopUp(false);
  };

  const handeBlur = () => {
    setTimeout(() => {
      setPopUp(false);
      setFocus(false);
    }, 200);
  };

  useEffect(() => {
    if (!focus) {
      setPopUp(false);
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
            value={busqueda}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={handeBlur}
          />
          {popUp && focus ? <PopUpSearch busqueda={busqueda} /> : null}
        </div>
      </div>
      <div className="contenedor-filtros-header">
        <button
          className={`btn-filtros ${
            filtrosActivos > 0 ? "con-filtros-activos" : ""
          }`}
          onClick={() => setToggleFiltros(!toggleFiltros)}
        >
          <span className="icono-filtro">⚙</span>
          <span className="texto-filtro">Filtros</span>
          {filtrosActivos > 0 && (
            <span className="contador-filtros">{filtrosActivos}</span>
          )}
        </button>

        {toggleFiltros && (
          <div className="menu-filtros-header">
            <div className="cabecera-filtros">
              <h3>Filtrar por etiquetas</h3>
              <button
                className="btn-cerrar-filtros"
                onClick={() => setToggleFiltros(false)}
              >
                ×
              </button>
            </div>
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
