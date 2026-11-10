(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GorillaNutritionBalance = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Adult macronutrient AMDRs are percent of total energy, not percent of body composition.
  // Age 18 uses the 4–18-year ranges; age 19+ uses adult ranges.
  // Source: National Academies, Dietary Reference Intakes, Appendix J.
  // https://nap.nationalacademies.org/skim.php?act=nap&chap=167-174&record_id=12512
  const AMDR = {
    18: { protein: [10, 30], carbohydrates: [45, 65], fats: [25, 35] },
    adult: { protein: [10, 35], carbohydrates: [45, 65], fats: [20, 35] }
  };

  const SPECS = [
    { key: 'protein', label: 'Proteínas', grams: 'proteinGrams', kcalPerGram: 4 },
    { key: 'carbohydrates', label: 'Carbohidratos', grams: 'carbohydrateGrams', kcalPerGram: 4 },
    { key: 'fats', label: 'Grasas', grams: 'fatGrams', kcalPerGram: 9 }
  ];

  function number(value) {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function classify(percent, range) {
    if (percent < range[0]) return 'BAJO';
    if (percent > range[1]) return 'ALTO';
    return 'MODERADO';
  }

  function compactFrequency(value) {
    if (!value) return '—';
    return String(value)
      .replace(/ veces por semana/gi, '/sem')
      .replace(/ vez por semana/gi, '/sem')
      .replace(/Casi nunca/gi, 'casi nunca')
      .replace(/Rara vez o nunca/gi, 'rara vez/nunca');
  }

  function detailFor(profile, key) {
    const p = profile || {};
    const value = function (field) { return compactFrequency(p[field]); };
    if (key === 'protein') {
      return 'Proteína: ' + value('protein') + ' · carne/huevos: ' + value('animalProteinFrequency') + ' · menestras: ' + value('legumeFrequency') + '.';
    }
    if (key === 'carbohydrates') {
      return 'Fruta: ' + value('fruitFrequency') + ' · verdura: ' + value('vegetableFrequency') + ' · comidas/día: ' + value('meals') + '.';
    }
    if (key === 'fats') {
      return 'Procesados/salados: ' + value('processedFoodsFrequency') + ' · no se mide grasa total.';
    }
    return 'Agua declarada: ' + value('water') + ' · falta volumen total exacto.';
  }

  function macroResult(profile, spec) {
    const p = profile || {};
    const grams = number(p[spec.grams]);
    const energy = number(p.totalEnergyKcal);
    const age = number(p.age);
    const insufficient = {
      key: spec.key,
      label: spec.label,
      percent: null,
      classification: 'INFORMACIÓN INSUFICIENTE',
      detail: detailFor(p, spec.key),
      reference: ''
    };
    if (grams === null || grams < 0 || energy === null || energy <= 0 || age === null || age < 18) return insufficient;

    const percent = grams * spec.kcalPerGram / energy * 100;
    if (!Number.isFinite(percent)) return insufficient;
    const range = age === 18 ? AMDR[18][spec.key] : AMDR.adult[spec.key];
    return {
      key: spec.key,
      label: spec.label,
      percent: Math.round(percent),
      classification: classify(percent, range),
      detail: 'Aporte energético estimado con gramos.',
      reference: 'AMDR ' + range[0] + '–' + range[1] + '% energía'
    };
  }

  function waterReference(profile) {
    const p = profile || {};
    const age = number(p.age);
    if (p.sex !== 'Hombre' && p.sex !== 'Mujer') return 'Referencia de agua total no disponible sin sexo y edad.';
    if (age === null || age < 18) return 'Referencia de agua total no disponible sin edad adulta.';
    if (p.sex === 'Mujer' && p.pregnancyStatus === 'Sí') return 'Embarazo: referencia de agua debe revisarse en una evaluación personalizada.';
    const isFemale = p.sex === 'Mujer';
    const liters = age === 18 ? (isFemale ? 2.3 : 3.3) : (isFemale ? 2.7 : 3.7);
    return 'AI orientativa de agua total: ' + liters.toFixed(1) + ' L/día; incluye alimentos y todas las bebidas.';
  }

  function hydrationResult(profile) {
    const p = profile || {};
    // NASEM total-water AIs include water in foods and all beverages. The current form only
    // collects a drinking-water interval, so it cannot validly yield an AI percentage or status.
    // Source: National Academies, Dietary Reference Intakes for Water (2005), Appendix J.
    // https://www.nationalacademies.org/read/10925/chapter/25
    return {
      key: 'hydration',
      label: 'Hidratación (agua)',
      percent: null,
      classification: 'INFORMACIÓN INSUFICIENTE',
      detail: 'Agua declarada: ' + (p.water || 'sin respuesta') + ' · falta un volumen exacto total.',
      reference: waterReference(p)
    };
  }

  function referenceSummary(age, sex, pregnancyStatus) {
    const years = number(age);
    if (years === 18) {
      const range = AMDR[18];
      return 'AMDR 18 años (% energía): proteínas ' + range.protein.join('–') + '%, carbohidratos ' + range.carbohydrates.join('–') + '%, grasas ' + range.fats.join('–') + '%.';
    }
    if (years !== null && years >= 19) {
      const range = AMDR.adult;
      return 'AMDR 19+ (% energía): proteínas ' + range.protein.join('–') + '%, carbohidratos ' + range.carbohydrates.join('–') + '%, grasas ' + range.fats.join('–') + '%.';
    }
    const youth = AMDR[18], adult = AMDR.adult;
    return 'AMDR (% energía): 18 años P ' + youth.protein.join('–') + '%, C ' + youth.carbohydrates.join('–') + '%, G ' + youth.fats.join('–') + '%; 19+ P ' + adult.protein.join('–') + '%, C ' + adult.carbohydrates.join('–') + '%, G ' + adult.fats.join('–') + '%.';
  }

  function calculate(profile) {
    const p = profile || {};
    return SPECS.map(function (spec) { return macroResult(p, spec); }).concat([hydrationResult(p)]);
  }

  return { calculate: calculate, referenceSummary: referenceSummary, waterReference: waterReference, AMDR: AMDR };
});
