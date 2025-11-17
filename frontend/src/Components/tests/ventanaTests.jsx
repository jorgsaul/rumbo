import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Button from '../botones/buttonPrimary';
import ButtonGhost from '../botones/buttonGhost';
import RadioBtn from '../forms/radiobtn';

import './ventanaTests.css';
export default function VentanaTests() {
  const [contenidoTest, setContenidoTest] = useState({});
  const [numeroPregunta, setNumeroPregunta] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [respuestas, setRespuestas] = useState([]);

  const { testId } = useParams();

  const handleFinalizar = ()=>{
    let respuestasCorrectas = 0;
    contenidoTest.preguntas.forEach((pregunta, index) => {
      if (pregunta.respuesta_correcta === respuestas[index]) {
        respuestasCorrectas++;
      }
    })
    const porcentaje = ((respuestasCorrectas / contenidoTest.preguntas.length) * 100).toFixed(2);
    console.log(porcentaje)
    try {
      fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/insertar-resultados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score:porcentaje, testId }),
        credentials: 'include'
      })

      window.location.href = '/recursos';
    } catch (error) {
      console.log(error);
    }
  }

  const handleContinuar = ()=>{
    setNumeroPregunta(numeroPregunta + 1);
  }

  const handleRegresar = ()=>{
    setNumeroPregunta(numeroPregunta - 1);
  }

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
  }

  useEffect(() => {
    obtenerContenidoTest();
  }, []);

  return cargando ? (
      <h1>Cargando...</h1>
    ) : (
    <div className="ventana-test">
      <h1 className="titulo-recursos">{contenidoTest.test_name}</h1>
      <h2>Pregunta {numeroPregunta + 1} de {contenidoTest.preguntas.length}</h2>
      <p><TextoMatematico texto={contenidoTest.preguntas[numeroPregunta].pregunta} /></p>
      {contenidoTest.preguntas[numeroPregunta].tabla ? (
        <table className="tabla-test">
          <thead>
            <tr>
              {contenidoTest.preguntas[numeroPregunta].tabla.columnas.map((columna, index) => (
                <th key={index}><TextoMatematico texto={columna} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contenidoTest.preguntas[numeroPregunta].tabla.filas.map((fila, index) => (
              <tr key={index}>
                {fila.map((celda, celdaIndex) => (
                  <td key={celdaIndex}>
                    {<TextoMatematico texto={celda} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ): contenidoTest.preguntas[numeroPregunta].enunciados ? (
        <div className="contenedor-enunciado">
          {
            contenidoTest.preguntas[numeroPregunta].enunciados.map((enunciado, index) => (
              <p key={index}>
                <TextoMatematico texto={enunciado} />
              </p>
            ))
          }
        </div>
      ) : null }
      <div className="contenedor-opciones-tests">
        {
           Object.keys(contenidoTest.preguntas[numeroPregunta].opciones).map((opcion) => (
            <RadioBtn 
            key={opcion} 
            input={
              <span>
                {opcion}. <TextoMatematico texto={contenidoTest.preguntas[numeroPregunta].opciones[opcion]} />
              </span>
            } 
            name={`pregunta-${numeroPregunta}`} 
            value={opcion} 
            accion={(e) => {
              const newRespuestas = [...respuestas];
              newRespuestas[numeroPregunta] = e.target.value;
              setRespuestas(newRespuestas);
            }}
            checked={respuestas[numeroPregunta] === opcion}
            />
          ))
        }
      </div>
      <div className="botones-test">
        {numeroPregunta > 0 && <ButtonGhost text={'Anterior'} action={handleRegresar} enable={true}/>}
        <Button 
        text={numeroPregunta === contenidoTest.preguntas.length - 1 ? 'Finalizar' : 'Siguiente'} 
        action={numeroPregunta === contenidoTest.preguntas.length - 1 ? handleFinalizar : handleContinuar} 
        enable={respuestas[numeroPregunta] !== undefined}
        />
      </div>
    </div>
)}
