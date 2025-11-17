import './VentanaInicio.css'
import CardLogin from '../cards/cardLogin'
import VentanaRegistro from './ventanaRegistro';
import VentanaRecuperarContraseña from './ventanaRecuperarContraseña';

import { useState } from 'react';


function VentanaInicio({cambiarVentana}){
  const [vista, setVista] = useState('login');
  return(
    <div className="contenedor-principal">
    {vista === 'registro' ? (
      <div className='overlay-background'>
        <div className='overlay-content'>
          <VentanaRegistro cambiarVentana={cambiarVentana} cambiarVista={setVista}/>
        </div>
      </div>
    ) : vista === 'recuperarCuenta' ? (
      <div className='overlay-background'>
        <div className='overlay-content'>
          <VentanaRecuperarContraseña />
        </div>
      </div>
    ): null}
      <div className="izquierda"></div>
      <div className="derecha">
        <CardLogin cambiarVista={setVista} cambiarVentana={cambiarVentana} />
      </div>
    </div>
  );
}

export default VentanaInicio;