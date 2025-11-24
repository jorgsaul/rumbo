import { useState, useEffect } from "react";
import "./App.css";
import VentanaInicio from "./Components/ventanas/ventanaInicio";
import VentanaPrincipal from "./Components/ventanas/ventanaPrincipal";
import AuthSuccess from "./Components/ventanas/auth-succes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ AGREGAR Routes, Route

function App() {
  const [ventana, cambiarVentana] = useState("inicio");
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const [url, options = {}] = args;

      // Agregar headers automáticamente a todas las requests de tu API
      if (typeof url === "string" && url.includes("rumbo-jcgl.onrender.com")) {
        const localToken = localStorage.getItem("auth_token");
        if (localToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${localToken}`,
          };
        }
        options.credentials = "include";
      }

      return originalFetch(url, options);
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  useEffect(() => {
    async function verificarAuth() {
      // ✅ VERIFICAR token en URL (lo que guardaste)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("auth_token", token); // ✅ Guardar como "auth_token"
        window.history.replaceState({}, "", "/");
        cambiarVentana("principal");
        return;
      }

      // ✅ LUEGO verificar localStorage (buscando "auth_token")
      const localToken = localStorage.getItem("auth_token"); // ✅ "auth_token"
      if (localToken) {
        cambiarVentana("principal");
        return;
      }

      // ✅ FINALMENTE verificar cookie (login normal)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/authenticate`,
          { credentials: "include" }
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
