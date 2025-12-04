import { useState, useEffect } from "react";
import "./App.css";
import VentanaInicio from "./Components/ventanas/ventanaInicio";
import VentanaPrincipal from "./Components/ventanas/ventanaPrincipal";
import AuthSuccess from "./Components/ventanas/auth-succes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FiltroProvider } from "./Components/context/FiltroContext";

function App() {
  const [ventana, cambiarVentana] = useState("inicio");
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const [url, options = {}] = args;

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

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  useEffect(() => {
    async function verificarAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("auth_token", token);
        window.history.replaceState({}, "", "/");
        cambiarVentana("principal");
        return;
      }

      const localToken = localStorage.getItem("auth_token");
      if (localToken) {
        cambiarVentana("principal");
        return;
      }

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
      <FiltroProvider>
        <Router>
          <Routes>
            <Route
              path="/auth-success"
              element={<AuthSuccess cambiarVentana={cambiarVentana} />}
            />

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
      </FiltroProvider>
    </div>
  );
}

export default App;
