import "./styles.css";
import PerfilVocacional from "./PerfilVocacional";
import TopCarreras from "./TopCarreras";

const Resultados = ({ resultados, onRestart }) => {
  return (
    <div className="results-screen">
      <div className="results-header">
        <h1>🎯 Tu Perfil Vocacional Ikigai</h1>
        <p>Descubre tu perfil único y las carreras que mejor se adaptan a ti</p>
      </div>

      <PerfilVocacional resultados={resultados} />
      <TopCarreras resultados={resultados} />

      <div className="results-actions">
        <button className="restart-button" onClick={onRestart}>
          🔄 Realizar otro test
        </button>
      </div>
    </div>
  );
};

export default Resultados;
