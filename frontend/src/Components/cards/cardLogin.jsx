import ButtonSocial from "../botones/buttonSocial";
import logoFacebook from "./img/Facebook_Logo_Primary.png";
import logoGoogle from "./img/Google_Symbol_1.png";
import InputBasic from "../forms/inputBasic";
import ButtonPrimary from "../botones/buttonPrimary";
import "./cardLogin.css";
import { useState, useEffect } from "react";

function CardLogin({ cambiarVista, cambiarVentana }) {
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
          credentials: "include",
        }
      );

      const data = await result.json();
      if (data.success) {
        cambiarVentana("principal");
        window.location.href = "/foro";
      } else {
        setError(true);
        setMensajeError("Error al iniciar sesion con google");
      }
    } catch (error) {
      console.error("Error al iniciar sesion con google:", error);
    }
  };

  const handleGoogleClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };
  const handeChange = () => {
    if (error) {
      setError(false);
      setMensajeError("");
    }
  };

  const validacion = () => {
    const usuario = document.getElementById("usuarioInputLogin").value;
    const contraseña = document.getElementById("contraseñaInputLogin").value;

    const inicioSesion = async () => {
      if (!usuario || !contraseña) {
        setError(true);
        setMensajeError("Los campos no pueden estar vacios");
        return;
      }
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identificador: usuario,
              contrasena: contraseña,
            }),
            credentials: "include",
          }
        );

        if (!respuesta.ok) {
          throw new Error("Error en la respuesta de la red");
        }

        const data = await respuesta.json();
        if (data.success) {
          cambiarVentana("principal");
          window.location.href = "/foro";
        } else {
          setError(true);
          setMensajeError("Usuario o contraseña incorrectos");
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
      }
    };

    inicioSesion();
  };

  return (
    <div className="contenedor-login">
      <div className="parte-superior">
        <div className="encabezado">
          <h1>Iniciar sesion</h1>
          <p style={{ fontSize: "0.8rem" }}>
            Inicia sesion para acceder a todo nuestro contenido
          </p>
        </div>
        <div className="form-inicio">
          <div className="Usuario">
            <InputBasic
              holder={"Ingresa tu nombre de usuario"}
              id={"usuarioInputLogin"}
              error={error}
              onChange={handeChange}
            />{" "}
          </div>
          <div className="Contraseña">
            <InputBasic
              type={"password"}
              holder={"Ingresa tu contraseña"}
              id={"contraseñaInputLogin"}
              error={error}
              errorMessage={mensajeError}
              onChange={handeChange}
            />{" "}
          </div>
          <div className="container-button">
            <ButtonPrimary
              enable={true}
              text={"Iniciar Sesion"}
              action={validacion}
            />
          </div>
          <div className="container-opciones">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                cambiarVista("recuperarCuenta");
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                cambiarVista("registro");
              }}
            >
              ¿No tienes una cuenta?
            </a>
          </div>
        </div>
      </div>
      <div className="parte-inferior">
        <hr />
        <p>Prueba inciando sesion con tus redes</p>
        <div className="contenedor-inicioRapido">
          <ButtonSocial
            texto="Continuar con google"
            img={logoGoogle}
            identificador="google"
            onClick={handleGoogleClick}
          ></ButtonSocial>

          <ButtonSocial
            texto="Continuar con facebook"
            img={logoFacebook}
            bgcolor={"blue"}
            identificador="facebook"
          ></ButtonSocial>
        </div>
      </div>
    </div>
  );
}

export default CardLogin;
