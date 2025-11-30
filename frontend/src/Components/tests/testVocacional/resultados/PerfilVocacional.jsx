import AreaCard from "./AreaCard";
import { useIkigaiCalculator } from "../../../../hooks/useIkigaiCalculator";
import "./style.css";

const PerfilVocacional = ({ resultados, userAnswers }) => {
  const { calcularPerfilVocacional } = useIkigaiCalculator();

  // USAR EL HOOK CORRECTAMENTE - calcular basado en las respuestas del usuario
  const areasPerfil =
    userAnswers && Object.keys(userAnswers).length > 0
      ? calcularPerfilVocacional(userAnswers)
      : calcularPerfilDesdeResultados(resultados); // Fallback si no hay userAnswers

  // Función de respaldo por si no hay userAnswers (solo para compatibilidad)
  const calcularPerfilDesdeResultados = (resultados) => {
    const areasBase = {
      tecnologico: { valor: 0, icono: "💻", label: "Tecnológico", count: 0 },
      cientifico: { valor: 0, icono: "🔬", label: "Científico", count: 0 },
      salud: { valor: 0, icono: "🏥", label: "Salud", count: 0 },
      administrativo: {
        valor: 0,
        icono: "📈",
        label: "Administrativo",
        count: 0,
      },
      social: { valor: 0, icono: "🤝", label: "Social", count: 0 },
    };

    if (!resultados || resultados.length === 0) {
      return areasBase;
    }

    resultados.forEach((carrera) => {
      const nombre = carrera.nombre.toLowerCase();
      let areaAsignada = "social"; // Por defecto

      if (
        nombre.includes("médico") ||
        nombre.includes("enfermería") ||
        nombre.includes("salud")
      ) {
        areaAsignada = "salud";
      } else if (
        nombre.includes("física") ||
        nombre.includes("matemática") ||
        nombre.includes("químico")
      ) {
        areaAsignada = "cientifico";
      } else if (
        nombre.includes("administración") ||
        nombre.includes("economía") ||
        nombre.includes("negocios")
      ) {
        areaAsignada = "administrativo";
      } else if (
        nombre.includes("ingeniería") ||
        nombre.includes("sistemas") ||
        nombre.includes("computación")
      ) {
        areaAsignada = "tecnologico";
      }

      if (areasBase[areaAsignada]) {
        areasBase[areaAsignada].count += 1;
      }
    });

    // Convertir counts a porcentajes
    Object.keys(areasBase).forEach((key) => {
      areasBase[key].valor = Math.round(
        (areasBase[key].count / resultados.length) * 100
      );
    });

    return areasBase;
  };

  console.log("📊 Perfil vocacional calculado:", areasPerfil);

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
