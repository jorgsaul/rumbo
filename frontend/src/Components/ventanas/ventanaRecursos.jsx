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
      </div>
      <VentanaResultados />
    </div>
  );
}

export default VentanaRecursos;
