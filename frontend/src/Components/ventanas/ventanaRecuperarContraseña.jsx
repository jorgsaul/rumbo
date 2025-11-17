import IconoEquis from "../iconos/iconoEquis"
import RegistroPaso2 from "../cards/cardPaso2"
import RegistroPaso3 from "../cards/cardPaso3"
import CardNuevaContraseña from "../cards/cardNuevaContraseña"
import { useState } from "react"
export default function VentanaRecuperarContraseña(){
  const [paso, setPaso] = useState('paso2');
  const [datos, setDatos] = useState({
    correo: '',
    codigo: '',
    codigoEscrito: '',
  });
  return(
    <div className="contenedor-ventanaRegistro">
      <div className="contenedor-equis"><IconoEquis funcion={()=> {window.location.href = '/login'}}/></div>
      <div className="contenido">
        <div className="titulo-registrate"><h1>Recuperar contraseña</h1></div>
        {paso === 'paso2' ? <RegistroPaso2 paso={setPaso} datos={datos} esRegistro={false} setDatos={setDatos}/> : null}
        {paso === 'paso3' ? <RegistroPaso3 paso={setPaso} datos={datos}/> : null}
        {paso === 'paso4' ? <CardNuevaContraseña datos={datos}/> : null}
      </div>
    </div>
  )
}