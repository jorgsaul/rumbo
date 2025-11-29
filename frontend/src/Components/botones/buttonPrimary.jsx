import "./buttonPrimary.css";
const Button = ({ text, action, enable = true, className, icon }) => {
  return (
    <button
      className={`${enable ? "common-button" : "disabled-button"} ${
        className || ""
      }`}
      onClick={enable ? action : undefined}
      disabled={!enable}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
