import Button from "../botones/buttonPrimary";
import ButtonGhost from "../botones/buttonGhost";
import './ventanaAviso.css';

export default function VentanaAviso({ mensaje, setAviso, funcionAceptar }) {
  const handleAceptar = () => {
    setAviso(false);
    funcionAceptar();
  };



  return (
    <div className="contenedor-ventanaAviso">
      <div className="contenido-ventanaAviso">
        <div className="titulo-registrate"><h1>Aviso</h1></div>
        <p>{mensaje}</p>
        <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
          <Button enable={true} text={'Aceptar'} action={handleAceptar}/>
          <ButtonGhost enable={true} text={'Cancelar'} action={()=> setAviso(false)}/>
        </div>
      </div>
    </div>
  );
}