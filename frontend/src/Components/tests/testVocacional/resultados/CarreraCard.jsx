const CarreraCard = ({ carrera, ranking }) => {
  return (
    <div className="career-card">
      <div
        className="career-rank"
        style={{ color: "white", backgroundColor: "#5A1236" }}
      >
        #{ranking}
      </div>

      <h3>{carrera.nombre}</h3>

      <div
        className="career-score"
        style={{ color: "white", backgroundColor: "#5A1236" }}
      >
        {carrera.puntuacion}% de compatibilidad
      </div>

      <div className="pillar-scores">
        <div className="pillar-item">
          <span className="pillar-label">Pasión:</span>
          <span
            className="pillar-value"
            style={{ color: "white", backgroundColor: "#5A1236" }}
          >
            {carrera.scores.pasion}%
          </span>
        </div>
        <div className="pillar-item">
          <span className="pillar-label">Vocación:</span>
          <span
            className="pillar-value"
            style={{ color: "white", backgroundColor: "#5A1236" }}
          >
            {carrera.scores.vocacion}%
          </span>
        </div>
        <div className="pillar-item">
          <span className="pillar-label">Profesión:</span>
          <span
            className="pillar-value"
            style={{ color: "white", backgroundColor: "#5A1236" }}
          >
            {carrera.scores.profesion}%
          </span>
        </div>
        <div className="pillar-item">
          <span className="pillar-label">Misión:</span>
          <span
            className="pillar-value"
            style={{ color: "white", backgroundColor: "#5A1236" }}
          >
            {carrera.scores.mision}%
          </span>
        </div>
      </div>

      <div className="zona-ikigai">
        <strong>Zona Ikigai:</strong> {carrera.zona_ikigai.replace(/_/g, " ")}
      </div>
    </div>
  );
};

export default CarreraCard;
