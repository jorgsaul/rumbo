const AreaCard = ({ icono, label, valor }) => {
  return (
    <div className="area-card">
      <div className="area-icon">{icono}</div>
      <h3>{label}</h3>
      <div
        className="area-score"
        style={{ color: "white", backgroundColor: "#5A1236" }}
      >
        {valor}%
      </div>
    </div>
  );
};

export default AreaCard;
