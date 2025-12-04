import "./ventanaRecursosExternos.css";
function VentanaRecursos() {
  const recursos = [
    {
      titulo: "Oferta Educativa del IPN",
      descripcion:
        "Consulta todas las carreras, programas y unidades académicas del IPN.",
      enlace: "https://www.ipn.mx/oferta-educativa/educacion-superior/",
    },
    {
      titulo: "Compara tus Carreras (IMCO)",
      descripcion:
        "Compara empleabilidad, salarios y demanda laboral de diversas carreras.",
      enlace: "https://comparacarreras.imco.org.mx/",
    },
  ];

  return (
    <div className="ventana-recursos">
      <h1>Recursos Externos</h1>
      <p>
        Herramientas y portales externos que te pueden ayudar a elegir tu
        carrera:
      </p>

      <div className="lista-recursos-externos">
        {recursos.map((r, i) => (
          <div key={i} className="recurso-externo-card">
            <h3>
              {r.titulo} <span className="icono-link-externo">↗</span>
            </h3>
            <p>{r.descripcion}</p>
            <button onClick={() => window.open(r.enlace, "_blank")}>
              Ir al recurso
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VentanaRecursos;
