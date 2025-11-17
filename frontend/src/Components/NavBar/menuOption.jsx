import './menuOption.css'

function MenuOption({icono,texto,funcion,activo,logout}){
  return(
    <div className={`contenedor-opcion-menu ${activo ? 'activo' : ''} ${logout ? 'logout' : ''}`} onClick={funcion}>
      <div className='contenedor-icono-menu'>{icono}</div><p>{texto}</p>
    </div>
  )
}

export default MenuOption;