import './checkbox.css'
function Checkbox({text, color, checked, accion}) {
  return (
    <div className="contenedor-checkbox">
      <input 
      type="checkbox" 
      className="checkbox" 
      style={{accentColor: color}}
      checked={checked}
      onChange={accion}
      /> {text}
    </div>
  )
}

export default Checkbox;