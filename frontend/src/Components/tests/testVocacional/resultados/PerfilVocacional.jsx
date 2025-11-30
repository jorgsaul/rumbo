import AreaCard from "./AreaCard";
import { useIkigaiCalculator } from "../../../../hooks/useIkigaiCalculator";
import "./style.css";

const PerfilVocacional = ({ resultados, userAnswers }) => {
  const { calcularPerfilVocacional } = useIkigaiCalculator();

  const calcularAreasPerfil = () => {
    const areas = {
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

    console.log(
      "🔍 Analizando",
      resultados.length,
      "carreras para perfil vocacional"
    );

    resultados.forEach((carrera) => {
      const nombre = carrera.nombre.toLowerCase();
      let areaAsignada = null;

      // 1. SALUD - Prioridad más alta (médicas, enfermería, odontología, etc.)
      if (
        nombre.includes("médico") ||
        nombre.includes("enfermería") ||
        nombre.includes("odontología") ||
        nombre.includes("nutrición") ||
        nombre.includes("optometría") ||
        nombre.includes("psicología") ||
        nombre.includes("trabajo social") ||
        nombre.includes("homeópata") ||
        nombre.includes("partero") ||
        nombre.includes("bacteriólogo")
      ) {
        areaAsignada = "salud";
      }
      // 2. CIENTÍFICO - Ciencias puras y geológicas
      else if (
        nombre.includes("geológica") ||
        nombre.includes("geofísica") ||
        nombre.includes("biotecnológica") ||
        nombre.includes("meteorología") ||
        nombre.includes("física") ||
        nombre.includes("matemática") ||
        nombre.includes("biología") ||
        nombre.includes("químico") ||
        nombre.includes("farmacéutico") ||
        nombre.includes("fotónica")
      ) {
        areaAsignada = "cientifico";
      }
      // 3. ADMINISTRATIVO - Negocios, economía, administración
      else if (
        nombre.includes("economía") ||
        nombre.includes("administración") ||
        nombre.includes("contador") ||
        nombre.includes("negocios") ||
        nombre.includes("mercadotecnia") ||
        nombre.includes("archivonomía") ||
        nombre.includes("biblioteconomía") ||
        nombre.includes("relaciones comerciales") ||
        nombre.includes("turismo")
      ) {
        areaAsignada = "administrativo";
      }
      // 4. SOCIAL - Psicología, trabajo social (si no fue capturado en salud)
      else if (
        nombre.includes("psicología") ||
        nombre.includes("trabajo social")
      ) {
        areaAsignada = "social";
      }
      // 5. TECNOLÓGICO - Por defecto para ingenierías
      else if (
        nombre.includes("ingeniería") ||
        nombre.includes("sistemas") ||
        nombre.includes("computación") ||
        nombre.includes("informática") ||
        nombre.includes("telemática") ||
        nombre.includes("robótica") ||
        nombre.includes("mecatrónica") ||
        nombre.includes("inteligencia artificial")
      ) {
        areaAsignada = "tecnologico";
      }
      // 6. Por defecto - Si no coincide con nada
      else {
        areaAsignada = "social"; // Por defecto a social
      }

      if (areaAsignada && areas[areaAsignada]) {
        areas[areaAsignada].valor += carrera.puntuacion;
        areas[areaAsignada].count += 1;
        console.log(`📌 ${carrera.nombre} → ${areas[areaAsignada].label}`);
      }
    });

    // Calcular porcentajes
    const total = Object.values(areas).reduce(
      (sum, area) => sum + area.valor,
      0
    );

    console.log("📊 Totales por área:", {
      tecnologico: {
        valor: areas.tecnologico.valor,
        count: areas.tecnologico.count,
      },
      cientifico: {
        valor: areas.cientifico.valor,
        count: areas.cientifico.count,
      },
      salud: { valor: areas.salud.valor, count: areas.salud.count },
      administrativo: {
        valor: areas.administrativo.valor,
        count: areas.administrativo.count,
      },
      social: { valor: areas.social.valor, count: areas.social.count },
    });

    console.log("🧮 Total general:", total);

    // Solo calcular porcentajes si hay valores
    if (total > 0) {
      Object.keys(areas).forEach((key) => {
        areas[key].valor = Math.round((areas[key].valor / total) * 100);
      });
    }

    console.log("🎯 Porcentajes finales:", areas);
    return areas;
  };

  const areasPerfil = userAnswers
    ? calcularPerfilVocacional(userAnswers)
    : {
        tecnologico: 0,
        cientifico: 0,
        salud: 0,
        administrativo: 0,
        social: 0,
      };

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
