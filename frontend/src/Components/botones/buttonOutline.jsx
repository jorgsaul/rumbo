import './buttonOutline.css'
function ButtonOutline({ text, funcion, enable = true, className }) {
  return (
    <button
      className={`${enable ? 'common-button-outline' : 'disabled-outline-button'} ${className || ''}`}
      onClick={enable ? funcion : undefined}
    >
      {text}
    </button>
  );
}

export default ButtonOutline;