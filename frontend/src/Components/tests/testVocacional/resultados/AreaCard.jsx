import "./style.css";
const AreaCard = ({ icono, label, valor }) => {
  return (
    <div className="area-card">
      <div className="area-icon">{icono}</div>
      <h3 className="area-label">{label}</h3>
      <div className="area-score">{valor}%</div>
    </div>
  );
};

export default AreaCard;
