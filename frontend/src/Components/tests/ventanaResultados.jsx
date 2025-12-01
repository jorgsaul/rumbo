import { useEffect, useState } from "react";
import GraficaRadar from "./grafica";

function VentanaResultados() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/obtener-resultados`,
          {
            credentials: "include",
            method: "GET",
          }
        );
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDatos();
  }, []);

  const datosGrafica = {
    labels: [
      "Ciencias Físico-Matemáticas",
      "Ciencias Biológicas y de la Salud",
      "Ingenierías y Tecnologías",
      "Ciencias Sociales y Humanidades",
      "Artes y Diseño",
      "Ciencias Económico-Administrativas",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0].map((valor, index) => {
          const resultado = datos?.find((d) => d.result_test_id === index + 1);
          return resultado ? parseFloat(resultado.result_score) : 0;
        }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="ventana-resultados">
      <div className="card-grafica-resultados">
        <h1 className="titulo-recursos">Tus resultados</h1>

        {datos === null || datos.length === 0 ? (
          <p>Realiza un test para ver tus resultados</p>
        ) : (
          <>
            <p>
              Continua haciendo tests para mejorar la grafica de tus resultados.
            </p>
            <div className="contenedor-grafica">
              <GraficaRadar datos={datosGrafica} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VentanaResultados;
