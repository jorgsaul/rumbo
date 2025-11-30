import Button from "../../botones/buttonPrimary";
import "./style.css";
const PantallaBienvenida = ({ onStart, hasSavedProgress, onContinue }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>🎯 Test Vocacional Ikigai IPN</h1>
          <p className="welcome-subtitle">
            Descubre las carreras que mejor se alinean con tu pasión, talento,
            propósito y aspiraciones profesionales
          </p>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>40 Preguntas Precisas</h3>
            <p>Cuestionario basado en los 4 pilares del Ikigai japonés</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Progreso Guardado</h3>
            <p>
              Tu progreso se guarda automáticamente. Puedes continuar cuando
              quieras
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>70 Carreras IPN</h3>
            <p>
              Resultados personalizados para todas las carreras del Instituto
              Politécnico Nacional
            </p>
          </div>
        </div>

        <div className="welcome-actions">
          {hasSavedProgress && (
            <Button
              text={"Continuar Test Anterior"}
              action={onContinue}
              enable={true}
              icon={"↻"}
              className={"large"}
            />
          )}

          <Button
            text={hasSavedProgress ? "Empezar Test Nuevo" : "Empezar Test"}
            action={onStart}
            enable={true}
            icon={"🚀"}
            className={"large"}
          />
        </div>

        <div className="welcome-info">
          <p>
            <strong>⏱️ Tiempo estimado:</strong> 15-20 minutos
          </p>
          <p>
            <strong>📝 Preguntas respondidas:</strong> Se guarda tu progreso
            automáticamente
          </p>
          <p>
            <strong>🎯 Resultados:</strong> Top 5 carreras + análisis detallado
          </p>
        </div>
      </div>
    </div>
  );
};

export default PantallaBienvenida;
