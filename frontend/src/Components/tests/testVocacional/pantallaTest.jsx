import { questions, careers } from "./testData";
import "./testVocacional.css";
const PantallaTest = ({
  currentQuestionIndex,
  userAnswers,
  totalQuestions,
  onSelectAnswer,
  onNext,
  onPrev,
  onGoToQuestion,
  onRestart,
}) => {
  const question = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[question.id];

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="test-screen">
      <div className="test-header">
        <div className="header-left">
          <div className="pilar-indicator">{question.pilar}</div>
          <div className="progress-stats">
            {answeredCount}/{totalQuestions} preguntas respondidas
          </div>
        </div>

        <div className="header-right">
          <button
            className="restart-test-btn"
            onClick={onRestart}
            title="Reiniciar test"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="overall-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {Math.round(progressPercentage)}% completado
        </span>
      </div>

      <div className="question-navigation">
        <div className="nav-title">Saltar a pregunta:</div>
        <div className="question-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-dot ${
                index === currentQuestionIndex ? "current" : ""
              } ${userAnswers[questions[index].id] ? "answered" : ""}`}
              onClick={() => onGoToQuestion(index)}
              title={`Pregunta ${index + 1} - ${
                userAnswers[questions[index].id]
                  ? "Respondida"
                  : "Sin responder"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="question-container">
        <div className="question-meta">
          <span className="question-number">
            Pregunta {currentQuestionIndex + 1} de {totalQuestions}
          </span>
          <span className="question-pilar">{question.pilar}</span>
        </div>

        <h2 className="question-text">{question.texto}</h2>

        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className={`likert-option ${
                currentAnswer === value ? "selected" : ""
              }`}
              onClick={() => onSelectAnswer(value)}
            >
              <span className="option-number">{value}</span>
              <span className="option-label">
                {value === 1 && "Nada"}
                {value === 2 && "Poco"}
                {value === 3 && "Neutral"}
                {value === 4 && "Bastante"}
                {value === 5 && "Muchísimo"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-button prev"
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
        >
          ← Anterior
        </button>

        <div className="navigation-info">
          <span className="answered-count">
            {answeredCount}/{totalQuestions} respondidas
          </span>
        </div>

        <button
          className="nav-button next"
          onClick={onNext}
          disabled={!currentAnswer}
        >
          {currentQuestionIndex === totalQuestions - 1
            ? "Ver Resultados"
            : "Siguiente →"}
        </button>
      </div>

      <div className="auto-save-indicator">
        <span className="save-icon">💾</span>
        Progreso guardado automáticamente
      </div>
    </div>
  );
};

export default PantallaTest;
