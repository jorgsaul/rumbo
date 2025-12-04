import "./ventanaRecursos.css";
import { useState, useEffect } from "react";
import { careers } from "../tests/testVocacional/testData";
import "./ventanaTestVocacional.css";
import Button from "../botones/buttonPrimary";

function VentanaTestVocacional() {
  const [resultadosVocacional, setResultadosVocacional] = useState(null);
  const [carrerasCompletas, setCarrerasCompletas] = useState(null);

  const obtenerCarreraCompleta = (topCarrerasId) => {
    if (!topCarrerasId) return [];

    return topCarrerasId.map((carreraTest) => {
      const carreraCompleta = careers.find((c) => c.id === carreraTest.id);
      return {
        ...carreraCompleta,
        puntuacion: carreraTest.puntuacion,
        scores: carreraTest.scores,
        zona_ikigai: carreraTest.zona_ikigai,
      };
    });
  };

  useEffect(() => {
    const cargarResultadosVocacional = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/historial`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.success && data.data.length > 0) {
            const resultado = data.data[0];
            setResultadosVocacional(resultado);

            let topCarrerasIds = resultado.top_carreras;

            if (typeof topCarrerasIds === "string") {
              topCarrerasIds = JSON.parse(topCarrerasIds);
            }

            setCarrerasCompletas(obtenerCarreraCompleta(topCarrerasIds));
          }
        }
      } catch (error) {
        console.log("Error cargando resultados vocacionales:", error);
      }
    };

    cargarResultadosVocacional();
  }, []);

  const areas = [
    { label: "Tecnológico", key: "perfil_tecnologico", icon: "💻" },
    { label: "Científico", key: "perfil_cientifico", icon: "🔬" },
    { label: "Salud", key: "perfil_salud", icon: "🏥" },
    { label: "Administrativo", key: "perfil_administrativo", icon: "📈" },
    { label: "Social", key: "perfil_social", icon: "🤝" },
  ];

  return (
    <div className="vtv-contenedor">
      <div className="vtv-header">
        <h1>Test Vocacional</h1>
        <p>
          Descubre tu perfil ideal y carreras recomendadas, así como tu Ikigai.
        </p>
      </div>

      {resultadosVocacional ? (
        <div className="vtv-vista">
          <div className="vtv-perfil-areas">
            {areas.map((area) => (
              <div className="vtv-area" key={area.key}>
                <div className="vtv-area-icon">{area.icon}</div>
                <div className="vtv-area-info">
                  <span className="vtv-area-label">{area.label}</span>
                  <div className="vtv-area-bar">
                    <div
                      className="vtv-area-fill"
                      style={{ width: `${resultadosVocacional[area.key]}%` }}
                    ></div>
                  </div>
                </div>
                <span className="vtv-area-porcentaje">
                  {resultadosVocacional[area.key]}%
                </span>
              </div>
            ))}
          </div>

          <div className="vtv-lista-carreras">
            {carrerasCompletas?.slice(0, 5).map((carrera, index) => (
              <div key={carrera.id} className="vtv-carrera">
                <div className="vtv-carrera-header">
                  <span className="vtv-ranking">#{index + 1}</span>
                  <h4 className="vtv-carrera-nombre">{carrera.nombre}</h4>
                  <span className="vtv-compatibilidad">
                    {carrera.puntuacion}%
                  </span>
                </div>

                <div className="vtv-carrera-info">
                  <div className="vtv-info-row">
                    <strong>🏫 Unidades:</strong> {carrera.unidades?.join(", ")}
                  </div>
                  <div className="vtv-info-row">
                    <strong>📚 Área:</strong> {carrera.area}
                  </div>
                  <div className="vtv-info-row">
                    <strong>💼 Empleabilidad:</strong>{" "}
                    {carrera.profesion?.empleabilidad}
                  </div>
                  <div className="vtv-info-row">
                    <strong>📈 Demanda:</strong> {carrera.profesion?.demanda}
                  </div>
                </div>

                <div className="vtv-habilidades">
                  {carrera.vocacion?.habilidades_tecnicas
                    ?.slice(0, 3)
                    .map((hab, i) => (
                      <span key={i} className="vtv-habilidad-tag">
                        {hab}
                      </span>
                    ))}
                </div>

                <div className="vtv-scores-ikigai">
                  <div className="vtv-score-item">
                    ❤️ Pasión: {carrera.scores?.pasion}%
                  </div>
                  <div className="vtv-score-item">
                    🎓 Vocación: {carrera.scores?.vocacion}%
                  </div>
                  <div className="vtv-score-item">
                    💼 Profesión: {carrera.scores?.profesion}%
                  </div>
                  <div className="vtv-score-item">
                    🌍 Misión: {carrera.scores?.mision}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Button
              text="Realizar Nuevo Test Vocacional"
              action={() =>
                (window.location.href = "/test-vocacional/realizar-test")
              }
            />
          </div>
        </div>
      ) : (
        <div className="vtv-sin-resultados">
          <div className="icono-sin-resultados">🎯</div>
          <h3>No hay resultados de test vocacional</h3>
          <p>
            Realiza el test vocacional para descubrir tu perfil y carreras
            ideales
          </p>
          <button
            className="boton-primario"
            onClick={() =>
              (window.location.href = "/test-vocacional/realizar-test")
            }
          >
            Realizar Test Vocacional
          </button>
        </div>
      )}
    </div>
  );
}

export default VentanaTestVocacional;
