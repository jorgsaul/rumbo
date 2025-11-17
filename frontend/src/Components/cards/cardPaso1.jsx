import './cardPaso1.css'
import RadioBtn from '../forms/radiobtn';
import Button from '../botones/buttonPrimary';
import { useState, useEffect } from 'react';

function RegistroPaso1({paso, setUsuario, datos}){
  const [seleccion, setSeleccion] = useState('');
  
  function cambioEstado(event) {
    setSeleccion(event.target.value);
  }

  useEffect(() => {
    if (datos.tipoUsuario) {
      setSeleccion(datos.tipoUsuario);
    }
  }, [datos.tipoUsuario]);
  
  return(
    <div className="contenedor-paso1">
      <p>Ingresa el rol que mejor te represente</p>
      <div className='contenedor-roles'>
        <RadioBtn 
          name={'paso1'} 
          input={'🎓 Estudiante universitario'} 
          value={'estudiante'}
          accion={cambioEstado}
          checked={seleccion === 'estudiante'}
        />
        <RadioBtn 
          name={'paso1'} 
          input={'🎉 Egresado/a de una carrera'} 
          value={'egresado'}
          accion={cambioEstado}
          checked={seleccion === 'egresado'}
        />
        <RadioBtn 
          name={'paso1'} 
          input={'👩‍🏫 Docente / orientador'} 
          value={'docente'}
          accion={cambioEstado}
          checked={seleccion === 'docente'}
        />
        <RadioBtn 
          name={'paso1'} 
          input={'🔍 Estudiante explorando opciones de carrera'} 
          value={'explorando'}
          accion={cambioEstado}
          checked={seleccion === 'explorando'}
        />
      </div>
      <div>
        <Button enable={!!seleccion} text={'Continuar'}  action={()=>{
          paso('paso2');
          setUsuario(prevDatos => ({...prevDatos, tipoUsuario:seleccion}))
        }}/>
      </div>
    </div>
  );
}

export default RegistroPaso1;