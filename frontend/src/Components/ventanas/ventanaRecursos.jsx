// VentanaRecursos.jsx - Versión corregida
import "./ventanaRecursos.css";
import CardRecurso from "../cards/cardRecurso";
import VentanaResultados from "../tests/ventanaResultados";
import { useState, useEffect } from "react";
import { careers } from "../tests/testVocacional/testData";

function VentanaRecursos() {
  const [resultadosVocacional, setResultadosVocacional] = useState(null);
  const [mostrandoVocacional, setMostrandoVocacional] = useState(false);
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
      <h1 className="titulo-recursos">¡Ponte a prueba!</h1>
      <p>Elige un desafío y mide tus habilidades.</p>

      <div className="botones-vista">
        <button
          className={`boton-vista ${!mostrandoVocacional ? "activo" : ""}`}
          onClick={() => setMostrandoVocacional(false)}
        >
          📚 Tests de Conocimientos
        </button>
        <button
          className={`boton-vista ${mostrandoVocacional ? "activo" : ""}`}
          onClick={() => setMostrandoVocacional(true)}
        >
          🎯 Test Vocacional
        </button>
      </div>

      {mostrandoVocacional ? (
        <div className="vista-vocacional">
          {resultadosVocacional ? (
            <>
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
                  <div className="area-vocacional">
                    <div className="area-icon">💻</div>
                    <div className="area-info">
                      <span className="area-label">Tecnológico</span>
                      <div className="area-bar">
                        <div
                          className="area-fill"
                          style={{
                            width: `${resultadosVocacional.perfil_tecnologico}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="area-porcentaje">
                      {resultadosVocacional.perfil_tecnologico}%
                    </span>
                  </div>

                  <div className="area-vocacional">
                    <div className="area-icon">🔬</div>
                    <div className="area-info">
                      <span className="area-label">Científico</span>
                      <div className="area-bar">
                        <div
                          className="area-fill"
                          style={{
                            width: `${resultadosVocacional.perfil_cientifico}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="area-porcentaje">
                      {resultadosVocacional.perfil_cientifico}%
                    </span>
                  </div>

                  <div className="area-vocacional">
                    <div className="area-icon">🏥</div>
                    <div className="area-info">
                      <span className="area-label">Salud</span>
                      <div className="area-bar">
                        <div
                          className="area-fill"
                          style={{
                            width: `${resultadosVocacional.perfil_salud}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="area-porcentaje">
                      {resultadosVocacional.perfil_salud}%
                    </span>
                  </div>

                  <div className="area-vocacional">
                    <div className="area-icon">📈</div>
                    <div className="area-info">
                      <span className="area-label">Administrativo</span>
                      <div className="area-bar">
                        <div
                          className="area-fill"
                          style={{
                            width: `${resultadosVocacional.perfil_administrativo}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="area-porcentaje">
                      {resultadosVocacional.perfil_administrativo}%
                    </span>
                  </div>

                  <div className="area-vocacional">
                    <div className="area-icon">🤝</div>
                    <div className="area-info">
                      <span className="area-label">Social</span>
                      <div className="area-bar">
                        <div
                          className="area-fill"
                          style={{
                            width: `${resultadosVocacional.perfil_social}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="area-porcentaje">
                      {resultadosVocacional.perfil_social}%
                    </span>
                  </div>
                </div>
              </div>

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
                            $
                            {carrera.profesion?.salario_inicial?.toLocaleString()}
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
                            <span>
                              🎓 Vocación: {carrera.scores?.vocacion}%
                            </span>
                          </div>
                          <div className="score-item">
                            <span>
                              💼 Profesión: {carrera.scores?.profesion}%
                            </span>
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

              <button
                className="boton-nuevo-test"
                onClick={() => (window.location.href = "/test-vocacional")}
              >
                🔄 Realizar Nuevo Test Vocacional
              </button>
            </>
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
                onClick={() => (window.location.href = "/test-vocacional")}
              >
                Realizar Test Vocacional
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="contenedor-lista-cards-recursos">
            <CardRecurso
              id={1}
              tiempo={"20 min"}
              descripcion={
                "Evalúa tus conocimientos matemáticas resolviendo problemas de matemáticas. Ideal para medir tu comprensión y rapidez en conceptos básicos."
              }
              titulo={"Tests de conocimientos matemáticas"}
              imagen={
                "https://st5.depositphotos.com/10614052/83217/i/450/depositphotos_832172778-stock-photo-number-school-stationery-green-chalkboard.jpg"
              }
            />
            <CardRecurso
              id={2}
              tiempo={"10 min"}
              descripcion={
                "Evalue sus conocimientos Medico Biologicas resolviendo problemas de biologia. Ideal para medir tu comprensión y rapidez en conceptos básicos."
              }
              titulo={"Tests de conocimientos medico biologicas"}
              imagen={
                "https://st2.depositphotos.com/1111793/8362/i/450/depositphotos_83627150-stock-photo-doctor-holding-urine-sample.jpg"
              }
            />
            <CardRecurso
              id={3}
              tiempo={"25min"}
              descripcion={
                "Evalue sus conocimientos en ingenieria y tecnologia resolviendo problemas de ingenieria y tecnologia. Averigua tu comprension y rapidez en conceptos basicos."
              }
              titulo={"Tests de conocimientos ingenieria y tecnologia"}
              imagen={
                "https://st.depositphotos.com/1007829/1700/i/450/depositphotos_17004541-stock-photo-technology-background-abstract-structure-and.jpg"
              }
            />
            <CardRecurso
              id={4}
              tiempo={"10 min"}
              descripcion={
                "Conteste unas preguntas de conocimientos sociales y humanisticas. Pon a prueba tus conocimientos sociales y humanisticas."
              }
              titulo={"Tests de conocimientos sociales y humanisticas"}
              imagen={
                "https://www.shutterstock.com/image-photo/manhattan-downtown-new-york-skyscrapers-600nw-2149071611.jpg"
              }
            />
            <CardRecurso
              titulo={"Test de conocmientos Artes y diseño"}
              id={5}
              tiempo={"10 min"}
              descripcion={
                "Responda unas preguntas de conocimientos artes y diseño. Pon a prueba tus conocimientos artes y diseño."
              }
              imagen={
                "https://img.freepik.com/vector-premium/ilustracion-creativa-espacio-trabajo-diseno-oficina-vibrante-elementos-inspiradores_1300528-15671.jpg?semt=ais_hybrid&w=740&q=80"
              }
            />
            <CardRecurso
              titulo={"Test de conocimientos economicos y administrativos"}
              id={6}
              tiempo={"10 min"}
              descripcion={
                "Responda unas preguntas de conocimientos economicos y administrativos. Pon a prueba tus conocimientos economicos y administrativos."
              }
              imagen={
                "https://images.unsplash.com/photo-1604594849809-dfedbc827105?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWNvbm9taWF8ZW58MHx8MHx8fDA%3D"
              }
            />
            <CardRecurso
              titulo="Test Vocacional"
              id={7}
              tiempo={"10 min"}
              descripcion="Responda unas preguntas de conocimientos vocacionales. Pon a prueba tus conocimientos vocacionales."
              imagen={
                "https://img.freepik.com/vector-gratis/alumno-mochila-rodeado-pulgares-arriba-nino-traje-oficial-siendo-respetado-ilustracion-vector-plano-sociedad-educacion-concepto-opinion-publica-banner-diseno-sitio-web-o-pagina-web-destino_74855-25270.jpg?semt=ais_hybrid&w=740&q=80"
              }
            />
          </div>
          <VentanaResultados />
        </>
      )}
    </div>
  );
}

export default VentanaRecursos;
