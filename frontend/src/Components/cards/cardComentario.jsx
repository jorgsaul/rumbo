import './cardComentario.css'
import AvatarPublicacion from '../avatar/avatarPublicacion'

function CardComentario({objeto}){
  return(
    <div className='contenedor-card-comentario'>

      <div className='contenedor-avatar-comentario'>
        <div className='contenedor-imagen-avatar-comentario'>
          <AvatarPublicacion urlImagen={objeto.avatar_url}/>
        </div>
      </div>

      <div className='contenedor-datos-comentario'>
        <div className='usuario-comentario'><p>{objeto.full_name}</p><b>@{objeto.username}</b></div>
        <div className='texto-comentario'><p>{objeto.content}</p></div>
      </div> 
    </div>
  )
}

export default CardComentario