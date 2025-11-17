import './buttonIcon.css'
const ButtonIcon = ({action, enable, icon})=>{
  return <button 
   className = {`${enable ? 'common-button-icon': 'disabled-button-icon'}`}
   onClick={enable? action: null}>{icon}</button>
}

export default ButtonIcon;
