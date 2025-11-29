import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Button from "../botones/buttonPrimary";
import ButtonGhost from "../botones/buttonGhost";
import RadioBtn from "../forms/radiobtn";
import "./ventanaTests.css";

export default function VentanaTests() {
  const [contenidoTest, setContenidoTest] = useState({});
  const [numeroPregunta, setNumeroPregunta] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [respuestas, setRespuestas] = useState([]);

  const { testId } = useParams();

  const getImagePath = (imageName) => {
    return `/tests/test${testId}/${imageName}`;
  };

  const handleFinalizar = async () => {
    let respuestasCorrectas = 0;
    contenidoTest.preguntas.forEach((pregunta, index) => {
      if (pregunta.respuesta_correcta === respuestas[index]) {
        respuestasCorrectas++;
      }
    });
    const porcentaje = (
      (respuestasCorrectas / contenidoTest.preguntas.length) *
      100
    ).toFixed(2);

    try {
      awaitfetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}/insertar-resultados`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: porcentaje, testId }),
          credentials: "include",
        }
      );

      window.location.href = "/recursos";
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinuar = () => {
    setNumeroPregunta(numeroPregunta + 1);
  };

  const handleRegresar = () => {
    setNumeroPregunta(numeroPregunta - 1);
  };

  function TextoMatematico({ texto }) {
    const ref = useRef(null);

    useEffect(() => {
      if (ref.current && texto && window.MathJax) {
        ref.current.innerHTML = texto;
        window.MathJax.typesetPromise([ref.current]);
      }
    }, [texto]);

    return <span ref={ref} />;
  }

  const obtenerContenidoTest = async () => {
    setCargando(true);
    try {
      const response = await fetch(`/test${testId}.json`);
      const data = await response.json();
      setContenidoTest(data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener el contenido del test:", error);
    }
  };

  useEffect(() => {
    obtenerContenidoTest();
  }, []);

  const preguntaActual = contenidoTest.preguntas?.[numeroPregunta];

  return cargando ? (
    <h1>Cargando...</h1>
  ) : (
    <div className="ventana-test">
      <h1 className="titulo-recursos">{contenidoTest.test_name}</h1>
      <h2>
        Pregunta {numeroPregunta + 1} de {contenidoTest.preguntas.length}
      </h2>

      <p>
        <TextoMatematico texto={preguntaActual.pregunta} />
      </p>

      {preguntaActual.imagen_secuencia && (
        <div className="contenedor-imagenes">
          <img
            src={getImagePath(preguntaActual.imagen_secuencia)}
            alt="Secuencia de figuras"
            className="imagen-secuencia"
          />
        </div>
      )}

      {preguntaActual.tabla ? (
        <table className="tabla-test">
          <thead>
            <tr>
              {preguntaActual.tabla.columnas.map((columna, index) => (
                <th key={index}>
                  <TextoMatematico texto={columna} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preguntaActual.tabla.filas.map((fila, index) => (
              <tr key={index}>
                {fila.map((celda, celdaIndex) => (
                  <td key={celdaIndex}>
                    <TextoMatematico texto={celda} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : preguntaActual.enunciados ? (
        <div className="contenedor-enunciado">
          {preguntaActual.enunciados.map((enunciado, index) => (
            <p key={index}>
              <TextoMatematico texto={enunciado} />
            </p>
          ))}
        </div>
      ) : null}

      <div className="contenedor-opciones-tests">
        {preguntaActual.opciones_imagenes
          ? Object.keys(preguntaActual.opciones_imagenes).map((opcion) => (
              <div
                key={opcion}
                className={`opcion-boton opcion-con-imagen ${
                  respuestas[numeroPregunta] === opcion ? "seleccionada" : ""
                }`}
                onClick={() => {
                  const newRespuestas = [...respuestas];
                  newRespuestas[numeroPregunta] = opcion;
                  setRespuestas(newRespuestas);
                }}
              >
                <div className="indicator-opcion">
                  <div className="contenido-opcion">
                    <span className="letra-opcion">{opcion}.</span>
                    <img
                      src={getImagePath(
                        preguntaActual.opciones_imagenes[opcion]
                      )}
                      alt={`Opción ${opcion}`}
                      className="imagen-opcion"
                    />
                  </div>
                </div>
              </div>
            ))
          : Object.keys(preguntaActual.opciones).map((opcion) => (
              <div
                key={opcion}
                className={`opcion-boton ${
                  respuestas[numeroPregunta] === opcion ? "seleccionada" : ""
                }`}
                onClick={() => {
                  const newRespuestas = [...respuestas];
                  newRespuestas[numeroPregunta] = opcion;
                  setRespuestas(newRespuestas);
                }}
              >
                <div className="indicator-opcion">
                  <div className="contenido-opcion">
                    <span className="letra-opcion">{opcion}.</span>
                    <span className="texto-opcion">
                      <TextoMatematico
                        texto={preguntaActual.opciones[opcion]}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="botones-test">
        {numeroPregunta > 0 && (
          <ButtonGhost
            text={"Anterior"}
            action={handleRegresar}
            enable={true}
          />
        )}
        <Button
          text={
            numeroPregunta === contenidoTest.preguntas.length - 1
              ? "Finalizar"
              : "Siguiente"
          }
          action={
            numeroPregunta === contenidoTest.preguntas.length - 1
              ? handleFinalizar
              : handleContinuar
          }
          enable={respuestas[numeroPregunta] !== undefined}
        />
      </div>
    </div>
  );
}
