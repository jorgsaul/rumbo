import { useState, useEffect } from "react";
import "./App.css";
import VentanaInicio from "./Components/ventanas/ventanaInicio";
import VentanaPrincipal from "./Components/ventanas/ventanaPrincipal";
import AuthSuccess from "./Components/ventanas/auth-succes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ AGREGAR Routes, Route

function App() {
  const [ventana, cambiarVentana] = useState("inicio");

  useEffect(() => {
    async function verificarAuth() {
      const localToken = localStorage.getItem("auth_token");
      if (localToken) {
        cambiarVentana("principal");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/authenticate`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.loggedIn) cambiarVentana("principal");
        else cambiarVentana("inicio");
      } catch (error) {
        cambiarVentana("inicio");
      }
    }
    verificarAuth();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* ✅ RUTA PARA AuthSuccess - SIEMPRE ACCESIBLE */}
          <Route
            path="/auth-success"
            element={<AuthSuccess cambiarVentana={cambiarVentana} />}
          />

          {/* ✅ RUTAS CONDICIONALES */}
          {ventana === "inicio" && (
            <Route
              path="*"
              element={<VentanaInicio cambiarVentana={cambiarVentana} />}
            />
          )}
          {ventana === "principal" && (
            <Route path="*" element={<VentanaPrincipal />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
