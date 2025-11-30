import { useState, useEffect } from "react";
import "./testVocacional.css";
import Button from "../botones/buttonPrimary";

import { questions, careers } from "./testData";

const TestVocacional = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [storageKey, setStorageKey] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const getStorageKey = () => {
    const googleToken = localStorage.getItem("auth_token");
    const cookieToken = getCookie("token");
    console.log("googleToken:", googleToken);
    console.log("cookieToken:", cookieToken);
    const token = localStorage.getItem("auth_token") || getCookie("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return `test_vocacional_progress_${payload.id}`;
      } catch (error) {
        console.error("Error al obtener el ID del usuario:", error);
      }
    }

    let sessionId = localStorage.getItem("test_session_id");
    if (!sessionId) {
      sessionId =
        `session_` +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 9);
      localStorage.setItem("test_session_id", sessionId);
    }
    return `test_vocacional_progress_${sessionId}`;
  };

  useEffect(() => {
    const key = getStorageKey();
    setStorageKey(key);

    const savedProgress = loadProgress(key);
    if (savedProgress) {
      setUserAnswers(savedProgress.answers);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
      setHasSavedProgress(true);
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(userAnswers).length > 0) {
      saveProgress();
    }
  }, [userAnswers, currentQuestionIndex, storageKey]);

  const loadProgress = (key = storageKey) => {
    if (!key) return null;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const progress = JSON.parse(saved);
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (progress.timestamp > oneWeekAgo) {
          return progress;
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error("Error cargando progreso:", error);
    }
    return null;
  };

  const saveProgress = () => {
    try {
      const progress = {
        answers: userAnswers,
        currentQuestionIndex,
        timestamp: Date.now(),
        totalQuestions: questions.length,
        answeredCount: Object.keys(userAnswers).length,
        userId: storageKey,
      };
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem(storageKey);
    setHasSavedProgress(false);
  };

  const startTest = (newTest = false) => {
    console.log("startTest llamado con newTest:", newTest);

    if (newTest) {
      clearProgress();
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTestResults(null);
    } else {
      const savedProgress = loadProgress();
      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        setUserAnswers(savedProgress.answers);
      }
    }
    setShowWelcome(false);
    console.log("showWelcome cambiado a: false");
  };

  const selectAnswer = (value) => {
    const question = questions[currentQuestionIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(Math.max(0, Math.min(index, questions.length - 1)));
  };

  const calculateResults = async () => {
    setIsLoading(true);

    setTimeout(() => {
      const results = calcularResultadosCompletos(userAnswers);
      setTestResults(results);
      setIsLoading(false);
      clearProgress();
    }, 1500);
  };

  // LÓGICA SIMPLIFICADA DE RENDERIZADO
  if (isLoading) {
    return <PantallaCarga />;
  }

  if (testResults) {
    return (
      <Resultados resultados={testResults} onRestart={() => startTest(true)} />
    );
  }

  if (showWelcome) {
    return (
      <PantallaBienvenida
        onStart={() => startTest(true)}
        hasSavedProgress={hasSavedProgress}
        onContinue={() => startTest(false)}
      />
    );
  }

  return (
    <div className="test-container">
      <PantallaTest
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        totalQuestions={questions.length}
        onSelectAnswer={selectAnswer}
        onNext={nextQuestion}
        onPrev={prevQuestion}
        onGoToQuestion={goToQuestion}
        onRestart={() => startTest(true)}
      />
    </div>
  );
};

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

const calcularResultadosCompletos = (userAnswers) => {
  const scores = {};

  careers.forEach((carrera) => {
    let totalScore = 0;
    let questionCount = 0;

    questions.forEach((pregunta) => {
      if (userAnswers[pregunta.id]) {
        const respuesta = userAnswers[pregunta.id];
        totalScore += respuesta * (carrera.pesos?.[pregunta.id] || 1);
        questionCount++;
      }
    });

    if (questionCount > 0) {
      scores[carrera.id] = {
        id: carrera.id,
        nombre: carrera.nombre,
        puntuacion: Math.round((totalScore / (questionCount * 5)) * 100),
      };
    }
  });

  return Object.values(scores)
    .sort((a, b) => b.puntuacion - a.puntuacion)
    .slice(0, 5);
};

const Resultados = ({ resultados, onRestart }) => {
  return (
    <div className="results-screen">
      <div className="results-header">
        <h1>🎯 Tus Resultados Ikigai</h1>
        <p>Estas son las carreras que mejor se alinean con tu perfil</p>
      </div>

      <div className="results-grid">
        {resultados.map((carrera, index) => (
          <div key={carrera.id} className="career-card">
            <div className="career-rank">#{index + 1}</div>
            <h3>{carrera.nombre}</h3>
            <div className="career-score">
              {carrera.puntuacion}% de compatibilidad
            </div>
          </div>
        ))}
      </div>

      <button className="restart-button" onClick={onRestart}>
        🔄 Realizar otro test
      </button>
    </div>
  );
};

const PantallaCarga = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <h2>Analizando tu Ikigai...</h2>
    <p>
      Estamos calculando las carreras que mejor se alinean con tu perfil único
    </p>
  </div>
);

export default TestVocacional;
