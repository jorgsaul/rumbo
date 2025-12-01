import AreaCard from "./AreaCard";
import { useIkigaiCalculator } from "../../../../hooks/useIkigaiCalculator";
import "./style.css";

const PerfilVocacional = ({ resultados, userAnswers }) => {
  const { calcularPerfilVocacional } = useIkigaiCalculator();

  const obtenerPerfilFormateado = () => {
    if (!userAnswers || Object.keys(userAnswers).length === 0) {
      return getPerfilDefault();
    }

    try {
      const perfilCalculado = calcularPerfilVocacional(userAnswers);

      const perfilFormateado = {
        tecnologico: {
          valor: perfilCalculado.tecnologico || 0,
          icono: "💻",
          label: "Tecnológico",
        },
        cientifico: {
          valor: perfilCalculado.cientifico || 0,
          icono: "🔬",
          label: "Científico",
        },
        salud: {
          valor: perfilCalculado.salud || 0,
          icono: "🏥",
          label: "Salud",
        },
        administrativo: {
          valor: perfilCalculado.administrativo || 0,
          icono: "📈",
          label: "Administrativo",
        },
        social: {
          valor: perfilCalculado.social || 0,
          icono: "🤝",
          label: "Social",
        },
      };

      console.log("🎯 Perfil formateado:", perfilFormateado);
      return perfilFormateado;
    } catch (error) {
      console.error("Error calculando perfil:", error);
      return getPerfilDefault();
    }
  };

  const getPerfilDefault = () => {
    return {
      tecnologico: { valor: 20, icono: "💻", label: "Tecnológico" },
      cientifico: { valor: 20, icono: "🔬", label: "Científico" },
      salud: { valor: 20, icono: "🏥", label: "Salud" },
      administrativo: { valor: 20, icono: "📈", label: "Administrativo" },
      social: { valor: 20, icono: "🤝", label: "Social" },
    };
  };

  const areasPerfil = obtenerPerfilFormateado();

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
