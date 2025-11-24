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

        console.log("Response: desde la app", response);
        const data = await response.json();
        console.log("Data: desde la app", data);

        if (data.loggedIn) {
          cambiarVentana("principal");
        } else {
          // ✅ Si viene de Google OAuth pero no detecta cookie, recargar
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("from") === "google") {
            // ✅ Esperar 2 segundos y verificar de nuevo
            setTimeout(async () => {
              const retryResponse = await fetch(
                `${import.meta.env.VITE_APP_API_BASE_URL}/authenticate`,
                {
                  credentials: "include",
                }
              );
              const retryData = await retryResponse.json();

              if (retryData.loggedIn) {
                cambiarVentana("principal");
              } else {
                // Solo recargar si sigue sin funcionar
                window.history.replaceState({}, "", "/");
                window.location.reload();
              }
            }, 2000);
            return; // ✅ Importante: salir de la función
          }
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
