import ButtonOutline from "../botones/buttonOutline";
import CardPublicacion from "../cards/cardPublicacion";
import './navTab.css'



function NavTab({setSubVentana}){
  return(
    <div>
      <div className="contenedor-navTab">
        <ButtonOutline text={'Publicaciones'} enable={true} funcion={()=> setSubVentana('publicaciones')}/>
        <ButtonOutline text={'Me gusta'} enable={true} funcion={()=> setSubVentana('megusta')}/>
        <ButtonOutline text={'Comentarios'} enable={true} funcion={()=> setSubVentana('comentarios')}/>
        <ButtonOutline text={'Favoritos'} enable={true} funcion={()=> setSubVentana('favoritos')}/>
      </div>
      <div className="contenedor-cambio-navTab">
        
      </div>
    </div>
  )
}

export default NavTab;