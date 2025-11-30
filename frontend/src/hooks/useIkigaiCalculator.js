// hooks/useIkigaiCalculator.js
import { useCallback } from 'react';
import { questions, careers } from './testData';

export const useIkigaiCalculator = () => {
  const normalizarRespuesta = useCallback((valor) => {
    return ((valor - 1) / 4) * 100;
  }, []);

  const construirPerfilUsuario = useCallback((respuestas) => {
    const perfil = {
      pasion: { palabras_clave: {}, actividades: {}, ambientes: {}, creatividad: 0 },
      vocacion: { 
        materias: { matematicas: 0, fisica: 0, quimica: 0, biologia: 0, expresion: 0 },
        competencias: {} 
      },
      profesion: { 
        salario_importante: 0, estabilidad: 0, sectores: {}, emprendimiento: 0, demanda: 0 
      },
      mision: { problemas: {}, impacto_social: 0 }
    };

    questions.forEach(pregunta => {
      const respuesta = respuestas[pregunta.id];
      if (!respuesta) return;

      const valorNormalizado = normalizarRespuesta(respuesta);

      // Procesar por categoría
      if (pregunta.categoria === 'pasion') {
        procesarPasion(perfil, pregunta, valorNormalizado, respuesta);
      } else if (pregunta.categoria === 'vocacion') {
        procesarVocacion(perfil, pregunta, valorNormalizado, respuesta);
      } else if (pregunta.categoria === 'profesion') {
        procesarProfesion(perfil, pregunta, valorNormalizado, respuesta);
      } else if (pregunta.categoria === 'mision') {
        procesarMision(perfil, pregunta, valorNormalizado, respuesta);
      }
    });

    return perfil;
  }, [normalizarRespuesta]);

  const procesarPasion = useCallback((perfil, pregunta, valorNormalizado, respuesta) => {
    if (pregunta.palabras_clave) {
      pregunta.palabras_clave.forEach(palabra => {
        perfil.pasion.palabras_clave[palabra] = 
          (perfil.pasion.palabras_clave[palabra] || 0) + valorNormalizado;
      });
    }
    if (pregunta.actividad) {
      perfil.pasion.actividades[pregunta.actividad] = valorNormalizado;
    }
    if (pregunta.ambiente) {
      perfil.pasion.ambientes[pregunta.ambiente] = valorNormalizado;
    }
    if (pregunta.atributo === 'creatividad') {
      perfil.pasion.creatividad = respuesta * 2;
    }
  }, []);

  const procesarVocacion = useCallback((perfil, pregunta, valorNormalizado, respuesta) => {
    if (pregunta.materia) {
      perfil.vocacion.materias[pregunta.materia] = respuesta * 2;
    }
    if (pregunta.competencia) {
      perfil.vocacion.competencias[pregunta.competencia] = valorNormalizado;
    }
  }, []);

  const procesarProfesion = useCallback((perfil, pregunta, valorNormalizado, respuesta) => {
    if (pregunta.aspecto === 'salario_alto') {
      perfil.profesion.salario_importante = valorNormalizado;
    } else if (pregunta.aspecto === 'estabilidad') {
      perfil.profesion.estabilidad = valorNormalizado;
    } else if (pregunta.aspecto === 'emprendimiento') {
      perfil.profesion.emprendimiento = respuesta * 2;
    } else if (pregunta.aspecto === 'demanda') {
      perfil.profesion.demanda = valorNormalizado;
    } else if (pregunta.sector) {
      perfil.profesion.sectores[pregunta.sector] = valorNormalizado;
    }
  }, []);

  const procesarMision = useCallback((perfil, pregunta, valorNormalizado, respuesta) => {
    if (pregunta.problema) {
      perfil.mision.problemas[pregunta.problema] = valorNormalizado;
    }
    if (pregunta.aspecto === 'impacto_social') {
      perfil.mision.impacto_social = respuesta * 2;
    }
  }, []);

  const calcularSimilitud = useCallback((valor1, valor2) => {
    const diferencia = Math.abs(valor1 - valor2);
    const maxDiferencia = 9;
    return 1 - (diferencia / maxDiferencia);
  }, []);

  const calcularCompatibilidadPasion = useCallback((perfilUsuario, carrera) => {
    let scorePalabras = calcularScorePorArray(perfilUsuario.pasion.palabras_clave, carrera.pasion.palabras_clave);
    let scoreActividades = calcularScorePorArray(perfilUsuario.pasion.actividades, carrera.pasion.actividades);
    let scoreAmbiente = calcularScorePorArray(perfilUsuario.pasion.ambientes, carrera.pasion.ambientes);
    
    const scoreCreatividad = calcularSimilitud(
      perfilUsuario.pasion.creatividad,
      carrera.pasion.nivel_creatividad
    ) * 100;

    return Math.round(
      scorePalabras * 0.40 +
      scoreActividades * 0.30 +
      scoreCreatividad * 0.15 +
      scoreAmbiente * 0.15
    );
  }, [calcularSimilitud]);

  const calcularCompatibilidadVocacion = useCallback((perfilUsuario, carrera) => {
    const scoreAcademico = calcularScoreAcademico(perfilUsuario, carrera);
    const scoreBlandas = calcularScorePorArray(perfilUsuario.vocacion.competencias, carrera.vocacion.habilidades_blandas);

    return Math.round(scoreAcademico * 0.70 + scoreBlandas * 0.30);
  }, []);

  const calcularCompatibilidadProfesion = useCallback((perfilUsuario, carrera) => {
    const scoreSalario = calcularScoreSalario(perfilUsuario, carrera);
    const scoreEmpleabilidad = carrera.profesion.empleabilidad;
    const scoreDemanda = calcularScoreDemanda(perfilUsuario, carrera);
    const scoreSectores = calcularScorePorArray(perfilUsuario.profesion.sectores, carrera.profesion.sectores);
    const scoreEmprendimiento = calcularSimilitud(
      perfilUsuario.profesion.emprendimiento,
      carrera.profesion.emprendimiento
    ) * 100;

    return Math.round(
      scoreSalario * 0.35 +
      scoreEmpleabilidad * 0.25 +
      scoreDemanda * 0.20 +
      scoreSectores * 0.10 +
      scoreEmprendimiento * 0.10
    );
  }, [calcularSimilitud]);

  const calcularCompatibilidadMision = useCallback((perfilUsuario, carrera) => {
    const scoreProblemas = calcularScorePorArray(perfilUsuario.mision.problemas, carrera.mision.problemas);
    const scoreImpacto = calcularSimilitud(
      perfilUsuario.mision.impacto_social,
      carrera.mision.impacto_social
    ) * 100;

    return Math.round(scoreProblemas * 0.70 + scoreImpacto * 0.30);
  }, [calcularSimilitud]);

  const calcularScorePorArray = useCallback((objetoUsuario, arrayCarrera) => {
    let score = 0;
    let count = 0;

    arrayCarrera.forEach(item => {
      if (objetoUsuario[item]) {
        score += objetoUsuario[item];
        count++;
      }
    });

    return count > 0 ? Math.min(score / count, 100) : 50;
  }, []);

  const calcularScoreAcademico = useCallback((perfilUsuario, carrera) => {
    let scoreAcademico = 0;
    let sumaImportancias = 0;

    Object.keys(carrera.vocacion.materias).forEach(materia => {
      const importanciaCarrera = carrera.vocacion.materias[materia];
      const habilidadUsuario = perfilUsuario.vocacion.materias[materia];

      const diferencia = importanciaCarrera - habilidadUsuario;
      let ajuste = diferencia > 0 ? 
        Math.max(0, habilidadUsuario - diferencia * 0.5) : 
        habilidadUsuario;

      scoreAcademico += ajuste * importanciaCarrera;
      sumaImportancias += importanciaCarrera;
    });

    return sumaImportancias > 0 ? (scoreAcademico / sumaImportancias) * 10 : 50;
  }, []);

  const calcularScoreSalario = useCallback((perfilUsuario, carrera) => {
    if (perfilUsuario.profesion.salario_importante > 70) {
      if (carrera.profesion.salario_inicial >= 20000) return 100;
      if (carrera.profesion.salario_inicial >= 15000) return 75;
      return 40;
    }
    return 70;
  }, []);

  const calcularScoreDemanda = useCallback((perfilUsuario, carrera) => {
    const mapaDemanda = { "Baja": 25, "Media": 50, "Alta": 75, "Muy Alta": 100 };
    let score = mapaDemanda[carrera.profesion.demanda] || 50;
    
    if (perfilUsuario.profesion.estabilidad > 70) {
      score = Math.min(score * 1.2, 100);
    }
    
    return score;
  }, []);

  const calcularIkigaiScore = useCallback((scores) => {
    const scoreBase = (
      scores.pasion * 0.25 +
      scores.vocacion * 0.25 +
      scores.profesion * 0.25 +
      scores.mision * 0.25
    );

    const minScore = Math.min(...Object.values(scores));
    const maxScore = Math.max(...Object.values(scores));
    
    let bonusBalance = 0;
    let penalizacion = 0;

    if (minScore >= 80) bonusBalance = 10;
    else if (minScore >= 70) bonusBalance = 5;

    if (maxScore - minScore > 40) penalizacion = -5;

    return Math.max(0, Math.min(100, Math.round(scoreBase + bonusBalance + penalizacion)));
  }, []);

  const identificarZonaIkigai = useCallback((scores) => {
    const P = scores.pasion >= 70;
    const V = scores.vocacion >= 70;
    const PR = scores.profesion >= 70;
    const M = scores.mision >= 70;

    if (P && V && PR && M) return "IKIGAI_PERFECTO";
    if (P && V && PR) return "PROFESION_IDEAL";
    if (V && PR && M) return "VOCACION_CLARA";
    if (PR && M && P) return "PROPOSITO_FUERTE";
    if (M && P && V) return "MISION_INSPIRADORA";
    if (P && V) return "PASION_Y_TALENTO";
    if (V && PR) return "CARRERA_SOLIDA";
    if (PR && M) return "IMPACTO_RENTABLE";
    if (P && M) return "SUEÑO_IDEALISTA";
    return "EXPLORAR_MAS";
  }, []);

  const calcularResultadosCompletos = useCallback((userAnswers) => {
    console.log("🎯 Ejecutando algoritmo IKIGAI...");
    
    const perfilUsuario = construirPerfilUsuario(userAnswers);
    const resultados = [];

    careers.forEach(carrera => {
      const scores = {
        pasion: calcularCompatibilidadPasion(perfilUsuario, carrera),
        vocacion: calcularCompatibilidadVocacion(perfilUsuario, carrera),
        profesion: calcularCompatibilidadProfesion(perfilUsuario, carrera),
        mision: calcularCompatibilidadMision(perfilUsuario, carrera)
      };

      const ikigaiScore = calcularIkigaiScore(scores);
      const zonaIkigai = identificarZonaIkigai(scores);

      resultados.push({
        id: carrera.id,
        nombre: carrera.nombre,
        puntuacion: ikigaiScore,
        scores: scores,
        zona_ikigai: zonaIkigai
      });
    });

    return resultados
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 5);
  }, [
    construirPerfilUsuario,
    calcularCompatibilidadPasion,
    calcularCompatibilidadVocacion,
    calcularCompatibilidadProfesion,
    calcularCompatibilidadMision,
    calcularIkigaiScore,
    identificarZonaIkigai
  ]);

  return {
    calcularResultadosCompletos
  };
};