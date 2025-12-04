import "./ventanaTestsConocimientos.css";
import CardRecurso from "../cards/cardRecurso";
import { Resultados } from "../tests/testVocacional/resultados";

function VentanaTestsConocimientos() {
  const tests = [
    {
      id: 1,
      titulo: "Matemáticas",
      descripcion:
        "Pon a prueba tus conocimientos matemáticos resolviendo problemas prácticos.",
      tiempo: "20 min",
      imagen:
        "https://st5.depositphotos.com/10614052/83217/i/450/depositphotos_832172778-stock-photo-number-school-stationery-green-chalkboard.jpg",
    },
    {
      id: 2,
      titulo: "Medico-Biológicas",
      descripcion:
        "Evalúa tus conocimientos de biología y ciencias médicas con ejercicios prácticos.",
      tiempo: "10 min",
      imagen:
        "https://st2.depositphotos.com/1111793/8362/i/450/depositphotos_83627150-stock-photo-doctor-holding-urine-sample.jpg",
    },
    {
      id: 3,
      titulo: "Ingeniería y Tecnología",
      descripcion:
        "Comprueba tu comprensión en conceptos de ingeniería y tecnología aplicados.",
      tiempo: "25 min",
      imagen:
        "https://st.depositphotos.com/1007829/1700/i/450/depositphotos_17004541-stock-photo-technology-background-abstract-structure-and.jpg",
    },
    {
      id: 4,
      titulo: "Sociales y Humanísticas",
      descripcion:
        "Pon a prueba tus conocimientos en historia, geografía y ciencias sociales.",
      tiempo: "10 min",
      imagen:
        "https://www.shutterstock.com/image-photo/manhattan-downtown-new-york-skyscrapers-600nw-2149071611.jpg",
    },
    {
      id: 5,
      titulo: "Artes y Diseño",
      descripcion:
        "Evalúa tus conocimientos en artes y diseño mediante preguntas creativas.",
      tiempo: "10 min",
      imagen:
        "https://img.freepik.com/vector-premium/ilustracion-creativa-espacio-trabajo-diseno-oficina-vibrante-elementos-inspiradores_1300528-15671.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      id: 6,
      titulo: "Económicas y Administrativas",
      descripcion:
        "Mide tu comprensión en economía, administración y finanzas básicas.",
      tiempo: "10 min",
      imagen:
        "https://images.unsplash.com/photo-1604594849809-dfedbc827105?fm=jpg&q=60&w=3000",
    },
  ];

  return (
    <div className="ventana-tests-contenedor">
      <div className="card-header-tests">
        <h1>Tests de Conocimientos</h1>
        <p>
          Elige un área y mide tus conocimientos de manera rápida y divertida.
        </p>
      </div>

      <div className="lista-cards-tests">
        {tests.map((test) => (
          <CardRecurso
            key={test.id}
            id={test.id}
            titulo={test.titulo}
            descripcion={test.descripcion}
            tiempo={test.tiempo}
            imagen={test.imagen}
          />
        ))}
      </div>

      <Resultados />
    </div>
  );
}

export default VentanaTestsConocimientos;
