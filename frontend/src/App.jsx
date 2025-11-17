import { useState, useEffect } from "react";
import "./App.css";
import VentanaInicio from "./Components/ventanas/ventanaInicio";
import VentanaPrincipal from "./Components/ventanas/ventanaPrincipal";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  const [ventana, cambiarVentana] = useState("inicio");

  useEffect(() => {
    async function verificarCookie() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/authenticate`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Error en la respuesta de la red");
        }
        const data = await response.json();
        if (data.loggedIn) {
          cambiarVentana("principal");
        }
      } catch (error) {
        console.error("Error al verificar la autenticación:", error);
      }
    }

    verificarCookie();
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
