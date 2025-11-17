import './buttonPrimary.css'
const Button = ({text, action, enable, className}) =>{
  return <button 
   className = {`${enable ? 'common-button': 'disabled-button'} ${className|| ''}`}
   onClick={enable? action: undefined}
   >{text}
   </button>  
}

export default Button;