import './header.css'
import logoImageHeader from '../img/Logo-blancoL-header.png'
import IconoBuscar from '../iconos/iconoBuscar';
function Header(){
  return(
    <header className="rumbo-header">
      <img src={logoImageHeader} alt="" className='logo-image-header'/>
      <div className='buscador-header'>
      <div className="buscador-contenedor">
        <span className='icono-buscar-buscador'><IconoBuscar /></span>
        <input type="text" placeholder="Prueba buscando algo" />
      </div>
    </div>
    </header>
  )
}

export default Header;