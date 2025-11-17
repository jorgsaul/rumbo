import './avatarPublicacion.css'

function AvatarPublicacion({urlImagen, className}){
  return(
    <div className={`avatar ${className}`}>
      <img src={urlImagen} className={`avatar-imagen`} alt = ''></img>
    </div>
  );
}

export default AvatarPublicacion;