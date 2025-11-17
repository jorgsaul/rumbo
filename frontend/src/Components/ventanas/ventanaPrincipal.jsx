import './ventanaPrincipal.css';
import Header from '../NavBar/header';
import Sider from '../NavBar/sider';
import VentanaForo from './ventanaForo';
import VentanaRecursos from './ventanaRecursos';
import VentanaPerfil from './ventanaPerfil';
import VentanaTests from '../tests/ventanaTests';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const ventanaActual = location.pathname.replace("/", "") || "foro";
  
  function cambioVentana(ruta) {
    navigate(`/${ruta}`);
  } 

  return (
    
    <div className='contenedor-ventanaPrincipal'>
      <div className='contenedor-header-principal'>
        <Header />
      </div>

      <div className='contenedor-cuerpo-principal'>
        <div className='contenedor-menu-izquierda'>
          <Sider cambioVentana={cambioVentana} ventana={ventanaActual} />
        </div>

        <div className='cambio-ventanas-principal'>
          <Routes>
            <Route path="/" element={<VentanaForo />} />
            <Route path="/foro" element={<VentanaForo />} />
            <Route path="/recursos" element={<VentanaRecursos />} />
            <Route path="/recursos/test/:testId" element={<VentanaTests />} />
            <Route path="/perfil" element={<VentanaPerfil />} />
            <Route path="/perfil/:idUsuario" element={<VentanaPerfil />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function VentanaPrincipal() {
  return (
    <Layout />
  );
}
