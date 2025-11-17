import './buttonGhost.css'
const ButtonGhost = ({text, action, enable})=>{
  return <button 
   className = {`${enable ? 'common-ghost-button': 'disabled-ghost-button'}`}
   onClick={enable? action: null}>{text} </button>
}

export default ButtonGhost;