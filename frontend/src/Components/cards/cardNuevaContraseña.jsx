import './cardPaso4.css'
import InputBasic from "../forms/inputBasic"
import Button from "../botones/buttonPrimary"
import { useState } from "react"
export default function CardNuevaContrasena({datos}){
  const [error, setError] = useState(false)
  const [errorMessage, setErroMessage] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [confContraseña, setConfContraseña] = useState('')

  function handleContraseña(e){
    setContraseña(e.target.value);
    setError(false);
  }

  function handleConfirmacionContraseña(e){
    setConfContraseña(e.target.value);
    setError(false);
  }

  function validacionContraseñas(contraseña, confContraseña){
    if(!/^.{8,30}$/.test(contraseña)) return "La contraseña debe ser de entre 8 a 30 caracteres";
    if(!/^[a-zñA-ZÑ0-9_\-\*\+.,]+$/.test(contraseña)) return "La contraseña tiene caracteres no validos";
    if(!/^\S+$/.test(contraseña)) return "La contraseña contiene espacios";
    if(contraseña!==confContraseña) return "Las contraseñas no coinciden"
    return "";
  }

  function cambiarContraseña(e){
    e.preventDefault();
    const errorMessage = validacionContraseñas(contraseña, confContraseña);
    if(errorMessage){
      setError(true);
      setErroMessage(errorMessage);
      return;
    }
    try {
      fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/cambiarContrasena`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: datos.correo, contraseña }),
      })
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
    window.location.href = '/login'
  }

  return(
    <div>
      <div className='formulario-datos-paso4'>
        <InputBasic holder={"Nueva contraseña"} type="password" onChange={handleContraseña} error={error}/>
        <InputBasic holder="Confirmar contraseña" type="password" onChange={handleConfirmacionContraseña} error={error} errorMessage={errorMessage}/>
        
      </div>
      <div>
        <Button text="Cambiar contraseña" enable={!error && contraseña && confContraseña} action={cambiarContraseña}/>
      </div>
    </div>
  )
}