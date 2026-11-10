(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GorillaResultBodies = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function bmiFor(profile) {
    if (pregnant(profile)) return 0;
    const height = Number(profile && profile.height);
    const weight = Number(profile && profile.weight);
    if (!height || !weight || height < 100 || weight <= 0) return 0;
    return weight / ((height / 100) ** 2);
  }

  function validSex(profile) {
    return profile && (profile.sex === 'Mujer' || profile.sex === 'Hombre') ? profile.sex : null;
  }

  function pregnant(profile) {
    return profile && profile.sex === 'Mujer' && profile.pregnancyStatus === 'Sí';
  }

  function descriptionCategory(profile) {
    const description = String(profile && (profile.bodyDescription || profile.bodyType || profile.bodyComposition || profile.build) || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (!description) return null;
    if (/delgad|flac|ectomorf/.test(description)) return { frame: 0, category: 'ectomorfa', label: 'Estructura delgada · referencia' };
    if (/muscul|atletic|tonific|mesomorf/.test(description)) return { frame: 2, category: 'mesomorfa', label: 'Desarrollo muscular · referencia' };
    if (/mayor volumen|robust|abdominal|endomorf|sobrepeso|obes|gord|rellen|corpul|fuerte con gordo|cuerpo de papa/.test(description)) return { frame: 3, category: 'endomorfa', label: 'Mayor volumen corporal · referencia' };
    return null;
  }

  function neutral(sex, bmi, reason) {
    return { sex: sex || null, frame: null, category: 'neutral', label: 'Referencia neutra', bmi: bmi || 0, reason: reason || 'Información insuficiente' };
  }

  function selectCurrent(profile) {
    const sex = validSex(profile);
    if (pregnant(profile)) return neutral(sex, 0, 'Seguimiento personalizado: no se selecciona una referencia usando IMC');
    const bmi = bmiFor(profile);
    if (!sex) return neutral(null, bmi, 'Falta el sexo para elegir una referencia correspondiente');
    const described = descriptionCategory(profile);
    if (described) return { sex: sex, frame: described.frame, category: described.category, label: described.label, bmi: bmi, reason: 'Descripción corporal declarada; referencia ilustrativa' };
    if (!bmi) return neutral(sex, bmi, 'Faltan estatura y peso para orientar la referencia');

    const activities = ['Ejercicio', 'Gimnasio', 'Otro deporte'];
    const activitySelected = activities.indexOf(profile.activity) >= 0;
    const trainingDays = Number(profile.days || 0);
    const highActivity = profile.activityLevel === 'Alto' || profile.activityLevel === 'Activo';
    const clearMuscularActivity = activitySelected && trainingDays >= 3 && highActivity;

    if (bmi < 18.5) {
      return { sex: sex, frame: 0, category: 'ectomorfa', label: 'Estructura delgada · referencia', bmi: bmi, reason: 'IMC orientativo bajo' };
    }
    if (bmi >= 28 && !clearMuscularActivity) {
      return { sex: sex, frame: 3, category: 'endomorfa', label: 'Mayor volumen corporal · referencia', bmi: bmi, reason: 'Peso y estatura sugieren mayor volumen; no es una medición de grasa corporal' };
    }
    if (clearMuscularActivity && bmi < 28) {
      return { sex: sex, frame: 2, category: 'mesomorfa', label: 'Desarrollo muscular · referencia', bmi: bmi, reason: 'Actividad y frecuencia de entrenamiento reportadas' };
    }
    return neutral(sex, bmi, 'Los datos no distinguen con confianza entre músculo y grasa corporal');
  }

  function selectTarget(profile, current) {
    const sex = validSex(profile);
    if (pregnant(profile)) return neutral(sex, 0, 'Seguimiento personalizado: no se proyecta una meta corporal usando IMC');
    const bmi = bmiFor(profile);
    if (!sex) return neutral(null, bmi, 'Falta el sexo para elegir una referencia correspondiente');

    const goal = String(profile && profile.goal || '').toLowerCase();
    if (goal.indexOf('masa muscular') >= 0) {
      return { sex: sex, frame: 2, category: 'mesomorfa', label: 'Desarrollo muscular · meta visual', bmi: bmi, reason: 'Referencia orientativa, no promesa de resultado' };
    }
    if (goal.indexOf('grasa') >= 0 || goal.indexOf('definici') >= 0 || goal.indexOf('oxidar') >= 0) {
      if (bmi > 0 && bmi < 19) {
        return { sex: sex, frame: current && current.frame !== null ? current.frame : null, category: current && current.frame !== null ? current.category : 'neutral', label: 'Objetivo a revisar con el profesional', bmi: bmi, reason: 'La ficha no propone una reducción de peso para una referencia de bajo IMC' };
      }
      return { sex: sex, frame: 1, category: 'equilibrada', label: 'Estructura equilibrada · meta visual', bmi: bmi, reason: 'Referencia orientativa, no promesa de resultado' };
    }
    if (goal.indexOf('resistencia') >= 0 || goal.indexOf('rendimiento') >= 0 || goal.indexOf('condición física') >= 0) {
      return { sex: sex, frame: 2, category: 'atlética', label: 'Apariencia atlética · meta visual', bmi: bmi, reason: 'Referencia orientativa, no promesa de resultado' };
    }
    if (current && current.sex === sex) return current;
    return neutral(sex, bmi, 'Elige un objetivo para mostrar una referencia visual');
  }

  return { bmiFor: bmiFor, selectCurrent: selectCurrent, selectTarget: selectTarget };
});
