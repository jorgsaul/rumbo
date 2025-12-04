import "./ventanaRecursos.css";
import { useState, useEffect } from "react";
import { careers } from "../tests/testVocacional/testData";
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

  return (
    <div className="ventana-recursos-contenedor">
      <div className="card-encabezado-recursos">
        <h1 className="titulo-recursos">Test Vocacional</h1>
        <p>
          Descubre tu perfil ideal y carreras recomendadas, así como información
          sobre tu Ikigai.
        </p>
      </div>

      {resultadosVocacional ? (
        <div className="vista-vocacional">
          <div className="resultados-vocacional-header">
            <h2>🎯 Tu Perfil Vocacional</h2>
            <p className="fecha-resultado">
              Test realizado:{" "}
              {new Date(resultadosVocacional.created_at).toLocaleDateString(
                "es-ES"
              )}
            </p>
            <p className="score-global">
              Score Global:{" "}
              <strong>{resultadosVocacional.score_global}%</strong>
            </p>
          </div>

          <div className="seccion-perfil">
            <h3>📊 Tu Perfil de Áreas</h3>

            <div className="perfil-areas">
              {[
                { label: "Tecnológico", key: "perfil_tecnologico", icon: "💻" },
                { label: "Científico", key: "perfil_cientifico", icon: "🔬" },
                { label: "Salud", key: "perfil_salud", icon: "🏥" },
                {
                  label: "Administrativo",
                  key: "perfil_administrativo",
                  icon: "📈",
                },
                { label: "Social", key: "perfil_social", icon: "🤝" },
              ].map((area) => (
                <div className="area-vocacional" key={area.key}>
                  <div className="area-icon">{area.icon}</div>
                  <div className="area-info">
                    <span className="area-label">{area.label}</span>
                    <div className="area-bar">
                      <div
                        className="area-fill"
                        style={{
                          width: `${resultadosVocacional[area.key]}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="area-porcentaje">
                    {resultadosVocacional[area.key]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP CARRERAS */}
          <div className="seccion-carreras">
            <h3>🏆 Top 5 Carreras Recomendadas</h3>

            <div className="lista-carreras-detalladas">
              {carrerasCompletas.slice(0, 5).map((carrera, index) => (
                <div key={carrera.id} className="carrera-detalle">
                  <div className="carrera-header">
                    <span className="ranking">#{index + 1}</span>
                    <h4 className="carrera-nombre">{carrera.nombre}</h4>
                    <span className="compatibilidad">
                      {carrera.puntuacion}%
                    </span>
                  </div>

                  <div className="carrera-info-completa">
                    <div className="info-row">
                      <strong>🏫 Unidades:</strong>
                      <span>{carrera.unidades?.join(", ")}</span>
                    </div>

                    <div className="info-row">
                      <strong>📚 Área:</strong>
                      <span>{carrera.area}</span>
                    </div>

                    <div className="info-row">
                      <strong>💼 Empleabilidad:</strong>
                      <span>{carrera.profesion?.empleabilidad}%</span>
                    </div>

                    <div className="info-row">
                      <strong>💰 Salario inicial:</strong>
                      <span>
                        ${carrera.profesion?.salario_inicial?.toLocaleString()}
                      </span>
                    </div>

                    <div className="info-row">
                      <strong>📈 Demanda:</strong>
                      <span>{carrera.profesion?.demanda}</span>
                    </div>

                    <div className="info-row">
                      <strong>🎯 Habilidades principales:</strong>
                      <div className="habilidades">
                        {carrera.vocacion?.habilidades_tecnicas
                          ?.slice(0, 3)
                          .map((hab, i) => (
                            <span key={i} className="habilidad-tag">
                              {hab}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="scores-ikigai">
                      <div className="score-item">
                        <span>❤️ Pasión: {carrera.scores?.pasion}%</span>
                      </div>
                      <div className="score-item">
                        <span>🎓 Vocación: {carrera.scores?.vocacion}%</span>
                      </div>
                      <div className="score-item">
                        <span>💼 Profesión: {carrera.scores?.profesion}%</span>
                      </div>
                      <div className="score-item">
                        <span>🌍 Misión: {carrera.scores?.mision}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        <div className="sin-resultados">
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
