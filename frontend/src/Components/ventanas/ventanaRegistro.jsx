import './ventanaRegistro.css'
import IconoEquis from '../iconos/iconoEquis';
import RegistroPaso1 from '../cards/cardPaso1';
import RegistroPaso2 from '../cards/cardPaso2';
import RegistroPaso3 from '../cards/cardPaso3';

import { useState } from 'react';
import RegistroPaso4 from '../cards/cardPaso4';

function VentanaRegistro({cambiarVista, cambiarVentana}){
  const [paso ,setPaso] = useState('paso1')
  const [datos, setDatos] = useState({
    tipoUsuario: '',
    correo:'',
    usuario:'',
    codigo: '',
  })
  
  
  function numPaso(paso){
    switch (paso){
      case 'paso1':
        return <RegistroPaso1 paso={setPaso} setUsuario={setDatos} datos={datos}/>
      case 'paso2':
        return <RegistroPaso2 paso={setPaso} setDatos={setDatos} datos={datos} esRegistro={true}/>
      case 'paso3':
        return <RegistroPaso3 paso={setPaso} datos={datos}/>
      case 'paso4':
        return <RegistroPaso4 terminarRegistro={cambiarVentana} setDatos={setDatos} datos={datos}/>
    }
  }
  function setVista(){
    cambiarVista('login')
  }
  return(
    <div className='contenedor-ventanaRegistro'>
      <div className='contenedor-equis'><IconoEquis funcion={setVista} /></div>
      <div className='contenido'>
        <div className='titulo-registrate'><h1>Crea tu cuenta</h1></div>
        <div className='pasos'>
          {numPaso(paso)}
        </div>
      </div>
    </div>
  );
}

export default VentanaRegistro;