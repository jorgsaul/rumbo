import "./ventanaRecursos.css";
import CardRecurso from "../cards/cardRecurso";
import VentanaResultados from "../tests/ventanaResultados";

function VentanaRecursos() {
  return (
    <div className="ventana-recursos-contenedor">
      <h1 className="titulo-recursos">¡Ponte a prueba!</h1>
      <p>Elige un desafío y mide tus habilidades.</p>

      <div className="contenedor-lista-cards-recursos">
        <CardRecurso
          id={1}
          tiempo={"20 min"}
          descripcion={
            "Evalúa tus habilidades matemáticas resolviendo problemas de matemáticas. Ideal para medir tu comprensión y rapidez en conceptos básicos."
          }
          titulo={"Tests de habilidades matemáticas"}
          imagen={
            "https://st5.depositphotos.com/10614052/83217/i/450/depositphotos_832172778-stock-photo-number-school-stationery-green-chalkboard.jpg"
          }
        />
        <CardRecurso
          id={2}
          tiempo={"10 min"}
          descripcion={
            "Evalue sus habilidades Medico Biologicas resolviendo problemas de biologia. Ideal para medir tu comprensión y rapidez en conceptos básicos."
          }
          titulo={"Tests de habilidades medico biologicas"}
          imagen={
            "https://st2.depositphotos.com/1111793/8362/i/450/depositphotos_83627150-stock-photo-doctor-holding-urine-sample.jpg"
          }
        />
        <CardRecurso
          id={3}
          tiempo={"20min"}
          descripcion={
            "Evalue sus habilidades en ingenieria y tecnologia resolviendo problemas de ingenieria y tecnologia. Averigua tu comprension y rapidez en conceptos basicos."
          }
          titulo={"Tests de habilidades ingenieria y tecnologia"}
          imagen={
            "https://st.depositphotos.com/1007829/1700/i/450/depositphotos_17004541-stock-photo-technology-background-abstract-structure-and.jpg"
          }
        />
      </div>
      <VentanaResultados />
    </div>
  );
}

export default VentanaRecursos;
