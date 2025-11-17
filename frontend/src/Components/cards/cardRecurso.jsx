import './cardRecurso.css'
import { Link } from 'react-router-dom';

function CardRecurso({titulo, descripcion, tiempo, imagen, id}){
  return(
    <Link to={`/recursos/test/${id}`} style={{textDecoration: 'none'}}>
    <div className='contenedor-card-recurso'>
      <div className='contenedor-card-recurso-imagen'><img src={imagen} alt="" /></div>
      <div className='contenedor-card-recurso-contenido'>
        <h3 className='titulo-card-recursos'>{titulo}</h3>
        <p className='descripcion-card-recursos'>{descripcion}</p>
        <p className='tiempo-card-recursos'>Tiempo estimado: {tiempo}</p>
      </div>
    </div>
    </Link>
  )
}

export default CardRecurso;