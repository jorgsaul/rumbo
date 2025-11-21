import InputBasic from "../forms/inputBasic";
import Button from "../botones/buttonPrimary";
import "./cardPaso4.css";
import { useState } from "react";

function RegistroPaso4({ terminarRegistro, setDatos, datos }) {
  const [error, setError] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confContraseña, setConfContraseña] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const validacion = async () => {
    if (!/^(?=(?:.*[a-zA-ZñÑ]){3,}).*$/.test(usuario))
      return "El usuario debe de contener al menos 3 letras";
    if (!/^.{4,15}$/.test(usuario))
      return "El usuario debe de ser de al menos 4 caracteres y no mayor a 15";
    if (!/^[a-zñA-ZÑ0-9_-]+$/.test(usuario))
      return "El usuario solo puede contener los simbolos _ o -";
    if (!/^.{8,30}$/.test(contraseña))
      return "La contraseña debe ser de entre 8 a 30 caracteres";
    if (!/^[a-zñA-ZÑ0-9_\-\*\+.,]+$/.test(contraseña))
      return "La contraseña tiene caracteres no validos";
    if (!/^\S+$/.test(contraseña)) return "La contraseña contiene espacios";
    if (contraseña !== confContraseña) return "Las contraseñas no coinciden";
    try {
      const usuarioExistente = await fetch(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/validarUsuarioExistente?usuario=${usuario}&correo=${datos.correo}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await usuarioExistente.json();
      console.log("🔍 Respuesta validación completa:", data);
      console.log("📊 Valor de existe:", data.existe);

      if (data.existe === true) {
        return "El nombre de usuario o correo ya existe";
      }
    } catch (error) {
      console.error("Error al validar el usuario:", error);
    }
    return "";
  };

  const handleConfContraseña = (e) => {
    setConfContraseña(e.target.value);
    setError(false);
  };

  const handleContraseña = (e) => {
    setContraseña(e.target.value);
    setError(false);
  };

  const handleUsuario = (e) => {
    setUsuario(e.target.value);
    setError(false);
  };

  const handleCrearCuenta = async () => {
    const mensajeError = await validacion();
    if (mensajeError === "") {
      setDatos((prev) => ({ ...prev, usuario: usuario }));
      try {
        await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/crearCuenta`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoUsuario: datos.tipoUsuario,
            correo: datos.correo,
            usuario: usuario,
            password: contraseña,
          }),
        });

        const respuesta = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/auto-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identificador: usuario,
            }),
            credentials: "include",
          }
        );

        if (!respuesta.ok) throw new Error("Error en la respuesta de la red");

        const data = await respuesta.json();
        if (data.success) {
          terminarRegistro("principal");
          window.location.href = "/foro";
        } else {
          setError(true);
          setErroMessage("Error al iniciar sesión después de crear la cuenta");
        }
      } catch (error) {
        console.error("Error al crear la cuenta:", error);
      }
    } else {
      setError(true);
      setErroMessage(mensajeError);
    }
  };

  return (
    <div>
      <p>¡Ya casi terminamos!</p>
      <div className="formulario-datos-paso4">
        <InputBasic
          holder={"Ingresa un nombre de usuario unico"}
          onChange={handleUsuario}
          value={usuario}
          error={error}
        />
        <InputBasic
          holder={"Contraseña"}
          onChange={handleContraseña}
          value={contraseña}
          type={"password"}
          error={error}
        />
        <InputBasic
          holder={"Confirma tu contraseña"}
          onChange={handleConfContraseña}
          value={confContraseña}
          type={"password"}
          error={error}
          errorMessage={errorMessage}
        />
      </div>
      <div>
        <Button
          text={"Crear cuenta"}
          enable={!!contraseña && !!usuario && !!confContraseña}
          action={handleCrearCuenta}
        />
      </div>
    </div>
  );
}

export default RegistroPaso4;
