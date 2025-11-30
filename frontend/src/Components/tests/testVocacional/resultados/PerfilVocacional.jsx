import AreaCard from "./AreaCard";

const PerfilVocacional = ({ resultados }) => {
  const calcularAreasPerfil = () => {
    const areas = {
      tecnologico: { valor: 0, icono: "💻", label: "Tecnológico" },
      cientifico: { valor: 0, icono: "🔬", label: "Científico" },
      salud: { valor: 0, icono: "🏥", label: "Salud" },
      administrativo: { valor: 0, icono: "📈", label: "Administrativo" },
      social: { valor: 0, icono: "🤝", label: "Social" },
    };

    resultados.forEach((carrera) => {
      if (
        carrera.nombre.includes("Ingeniería") &&
        !carrera.nombre.includes("Ambiental") &&
        !carrera.nombre.includes("Alimentos")
      ) {
        areas.tecnologico.valor += carrera.puntuacion;
      } else if (
        carrera.nombre.includes("Químico") ||
        carrera.nombre.includes("Bio") ||
        carrera.nombre.includes("Física")
      ) {
        areas.cientifico.valor += carrera.puntuacion;
      } else if (
        carrera.nombre.includes("Médico") ||
        carrera.nombre.includes("Enfermería") ||
        carrera.nombre.includes("Odontología") ||
        carrera.nombre.includes("Nutrición")
      ) {
        areas.salud.valor += carrera.puntuacion;
      } else if (
        carrera.nombre.includes("Licenciatura") ||
        carrera.nombre.includes("Administración") ||
        carrera.nombre.includes("Negocios")
      ) {
        areas.administrativo.valor += carrera.puntuacion;
      } else {
        areas.social.valor += carrera.puntuacion;
      }
    });

    const total = Object.values(areas).reduce(
      (sum, area) => sum + area.valor,
      0
    );
    Object.keys(areas).forEach((key) => {
      areas[key].valor = Math.round((areas[key].valor / total) * 100);
    });

    return areas;
  };

  const areasPerfil = calcularAreasPerfil();

  return (
    <div className="profile-section">
      <h2>📊 Tu Perfil Vocacional</h2>
      <div className="profile-areas">
        {Object.entries(areasPerfil).map(([key, area]) => (
          <AreaCard
            key={key}
            icono={area.icono}
            label={area.label}
            valor={area.valor}
          />
        ))}
      </div>
    </div>
  );
};

export default PerfilVocacional;
