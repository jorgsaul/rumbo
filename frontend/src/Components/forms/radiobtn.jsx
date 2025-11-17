import './radiobtn.css'
function RadioBtn({name, value, input, accion, checked}){
  return(
    <div className='contenedor-radiobtn'>
      <input 
      className="RadioBtn" 
      type="radio" 
      name={name}
      value={value}
      onChange={accion}
      checked={checked}
      /> {input}
    </div>
  )
}

export default RadioBtn;