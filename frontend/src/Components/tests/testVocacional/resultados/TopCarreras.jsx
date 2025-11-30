import CarreraCard from "./CarreraCard";

const TopCarreras = ({ resultados }) => {
  const top10Carreras = resultados.slice(0, 10);

  return (
    <div className="top-careers-section">
      <h2>🏆 Top 10 Carreras Recomendadas</h2>
      <div className="careers-grid expanded">
        {top10Carreras.map((carrera, index) => (
          <CarreraCard key={carrera.id} carrera={carrera} ranking={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default TopCarreras;
