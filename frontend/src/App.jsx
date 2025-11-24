import { useState, useEffect } from "react";
import "./App.css";
import VentanaInicio from "./Components/ventanas/ventanaInicio";
import VentanaPrincipal from "./Components/ventanas/ventanaPrincipal";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [ventana, cambiarVentana] = useState("inicio");

  useEffect(() => {
    async function verificarAuth() {
      // ✅ PRIMERO verificar localStorage (Google/Facebook)
      const localToken = localStorage.getItem("auth_token");
      if (localToken) {
        cambiarVentana("principal");
        return;
      }

      // ✅ LUEGO verificar cookie (login normal)
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

  function cambioVentana() {
    switch (ventana) {
      case "inicio":
        return <VentanaInicio cambiarVentana={cambiarVentana} />;
      case "principal":
        return <VentanaPrincipal />;
    }
  }

  return (
    <div className="App">
      <Router>
        {ventana === "inicio" && (
          <VentanaInicio cambiarVentana={cambiarVentana} />
        )}
        {ventana === "principal" && <VentanaPrincipal />}
      </Router>
    </div>
  );
}

export default App;
