import './buttonSocial.css'

function ButtonSocial({texto, img, identificador, bgcolor}){
  function seleccion(){
    const button = document.getElementById();
    
    switch(button){      
      case "google":
        
      case "facebook":
        
      case "telefono":
        
      }
  }
  

  return(
    <button className = {`contenedor ${identificador}`} style={{backgroundColor:{bgcolor}}}>
      <div className="img-button"><img src={img} alt="" /></div>
      <div className = "txt-button" >{texto}</div>
    </button>
  ); 
}

export default ButtonSocial;