import "./buttonSocial.css";

function ButtonSocial({ texto, img, identificador, bgcolor, onClick }) {
  return (
    <button
      className={`contenedor ${identificador}`}
      style={{ backgroundColor: bgcolor }}
      onClick={onClick}
    >
      <div className="img-button">
        <img src={img} alt="" />
      </div>
      <div className="txt-button">{texto}</div>
    </button>
  );
}

export default ButtonSocial;
