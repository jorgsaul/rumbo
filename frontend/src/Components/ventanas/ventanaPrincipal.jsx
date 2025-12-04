import "./ventanaPrincipal.css";
import Header from "../NavBar/header";
import Sider from "../NavBar/sider";
import VentanaForo from "./ventanaForo";
import VentanaRecursos from "./ventanaRecursos";
import VentanaPerfil from "./ventanaPerfil";
import VentanaTests from "../tests/ventanaTests";
import AuthSuccess from "./auth-succes";
import VentanaResultados from "../busquedas/ventanaResultados";
import TestVocacional from "../tests/testVocacional/testVocacional";
import VentanaTestVocacional from "./ventanaTestsVocacional";
import VentanaTestsConocimientos from "./ventanaTestsConocimientos";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const ventanaActual = location.pathname.replace("/", "") || "foro";

  function cambioVentana(ruta) {
    navigate(`/${ruta}`);
  }

  return (
    <div className="contenedor-ventanaPrincipal">
      <div className="contenedor-header-principal">
        <Header />
      </div>

      <div className="contenedor-cuerpo-principal">
        <div className="contenedor-menu-izquierda">
          <Sider cambioVentana={cambioVentana} ventana={ventanaActual} />
        </div>

        <div className="cambio-ventanas-principal">
          <Routes>
            <Route path="/" element={<VentanaForo />} />
            <Route path="/foro" element={<VentanaForo />} />
            <Route
              path="/test-vocacional"
              element={<VentanaTestVocacional />}
            />
            <Route
              path="/test-conocimientos"
              element={<VentanaTestsConocimientos />}
            />
            <Route path="/recursos" element={<VentanaRecursos />} />
            <Route
              path="/tests-conocimientos/test/:testId"
              element={<VentanaTests />}
            />
            <Route path="/perfil" element={<VentanaPerfil />} />
            <Route path="/perfil/:idUsuario" element={<VentanaPerfil />} />
            <Route path="auth-success" element={<AuthSuccess />} />
            <Route path="/busqueda/:busqueda" element={<VentanaResultados />} />
            <Route
              path="/test-vocacional/realizar-test"
              element={<TestVocacional />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function VentanaPrincipal() {
  return <Layout />;
}
