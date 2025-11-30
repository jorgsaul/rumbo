import { useState, useEffect, use } from "react";
import "./resultados/style.css";
import PantallaBienvenida from "./pantallaBienvenida";
import PantallaCarga from "./pantallaCarga";
import PantallaTest from "./pantallaTest";
import { Resultados } from "./resultados";
import { questions, careers } from "./testData";
import { useIkigaiCalculator } from "../../../hooks/useIkigaiCalculator";

const TestVocacional = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [storageKey, setStorageKey] = useState(null);
  const { calcularResultadosCompletos } = useIkigaiCalculator();
  const { calcularPerfilVocacional } = useIkigaiCalculator();
  const getStorageKey = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/perfil`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error en la respuesta de la red");
      const userData = await response.json();

      if (userData && userData.id) {
        return `test_vocacional_progress_${userData.id}`;
      }
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
    }

    return getStorageKeyFallback();
  };

  const getStorageKeyFallback = () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        if (userId) {
          return `test_vocacional_progress_${userId}`;
        }
      } catch (error) {
        console.error("Error al obtener el ID del usuario:", error);
      }
    }

    let sessionId = localStorage.getItem("test_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      localStorage.setItem("test_session_id", sessionId);
    }
    return `test_vocacional_progress_${sessionId}`;
  };

  useEffect(() => {
    const initializeTest = async () => {
      const key = await getStorageKey();
      setStorageKey(key);

      const savedProgress = loadProgress(key);
      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        setUserAnswers(savedProgress.answers);
        setHasSavedProgress(true);
        setShowWelcome(false);
      }
    };
    initializeTest();
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

    setTimeout(async () => {
      const results = calcularResultadosCompletos(userAnswers, 10);
      const perfilVocacional = calcularPerfilVocacional(userAnswers);
      const zonaIkigai = results[0]?.zonaIkigai || "EXPLORAR_MAS";
      setTestResults(results);
      setIsLoading(false);
      clearProgress();

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/guardar-resultados`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resultados: results,
              perfilVocacional: perfilVocacional,
              resultadosCompletos: userAnswers,
              zonaIkigai: zonaIkigai,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          console.log("Resultados guardados exitosamente");
        } else {
          console.warn("Resultados no guardados");
        }
      } catch (error) {
        console.error("Error guardando resultados:", error);
      }
    }, 1500);
  };

  if (isLoading) {
    return <PantallaCarga />;
  }

  if (testResults) {
    return (
      <Resultados
        resultados={testResults}
        onRestart={() => startTest(true)}
        userAnswers={userAnswers}
      />
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

export default TestVocacional;
