const test = require('node:test');
const assert = require('node:assert/strict');
const { bmiFor, selectCurrent, selectTarget } = require('../result-body-selection.js');

const cases = [
  { name: 'hombre con mayor volumen corporal', profile: { sex: 'Hombre', height: 175, weight: 100, activity: 'No entreno actualmente', activityLevel: 'Bajo', days: 0 }, frame: 3, category: 'endomorfa' },
  { name: 'mujer con mayor volumen corporal', profile: { sex: 'Mujer', height: 162, weight: 90, activity: 'No entreno actualmente', activityLevel: 'Bajo', days: 0 }, frame: 3, category: 'endomorfa' },
  { name: 'hombre de estructura delgada', profile: { sex: 'Hombre', height: 180, weight: 58, activity: 'No entreno actualmente', activityLevel: 'Bajo', days: 0 }, frame: 0, category: 'ectomorfa' },
  { name: 'mujer de estructura delgada', profile: { sex: 'Mujer', height: 165, weight: 49, activity: 'No entreno actualmente', activityLevel: 'Bajo', days: 0 }, frame: 0, category: 'ectomorfa' },
  { name: 'hombre con desarrollo muscular reportado', profile: { sex: 'Hombre', height: 178, weight: 82, activity: 'Gimnasio', activityLevel: 'Alto', days: 4 }, frame: 2, category: 'mesomorfa' },
  { name: 'mujer con desarrollo muscular reportado', profile: { sex: 'Mujer', height: 165, weight: 68, activity: 'Ejercicio', activityLevel: 'Activo', days: 4 }, frame: 2, category: 'mesomorfa' }
];

for (const scenario of cases) {
  test(`selecciona una referencia coherente: ${scenario.name}`, () => {
    const result = selectCurrent(scenario.profile);
    assert.equal(result.sex, scenario.profile.sex);
    assert.equal(result.frame, scenario.frame);
    assert.equal(result.category, scenario.category);
  });
}

test('la edad no cambia la selección de imagen', () => {
  const profile = { sex: 'Hombre', height: 178, weight: 82, activity: 'Gimnasio', activityLevel: 'Alto', days: 4 };
  assert.deepEqual(selectCurrent({ ...profile, age: 18 }), selectCurrent({ ...profile, age: 90 }));
});

test('la descripción corporal disponible tiene prioridad sobre el IMC', () => {
  const result = selectCurrent({ sex: 'Mujer', height: 165, weight: 60, bodyDescription: 'mayor volumen abdominal' });
  assert.equal(result.frame, 3);
  assert.equal(result.category, 'endomorfa');
});

test('usa una referencia neutra cuando la complexión es ambigua', () => {
  const result = selectCurrent({ sex: 'Mujer', height: 165, weight: 60, activity: 'No entreno actualmente', activityLevel: 'Bajo', days: 0 });
  assert.equal(result.frame, null);
  assert.equal(result.category, 'neutral');
});

test('elige la meta visual según el objetivo y mantiene el género', () => {
  const current = selectCurrent({ sex: 'Mujer', height: 165, weight: 70, activity: 'Gimnasio', activityLevel: 'Alto', days: 3 });
  assert.equal(selectTarget({ sex: 'Mujer', height: 165, weight: 70, goal: 'Aumentar masa muscular' }, current).frame, 2);
  assert.equal(selectTarget({ sex: 'Mujer', height: 165, weight: 70, goal: 'Reducir grasa corporal' }, current).frame, 1);
  assert.equal(selectTarget({ sex: 'Mujer', height: 165, weight: 70, goal: 'Mejorar resistencia física' }, current).frame, 2);
});

test('no calcula IMC ni selecciona cuerpos por medidas durante el embarazo', () => {
  const pregnant = { sex: 'Mujer', pregnancyStatus: 'Sí', height: 165, weight: 72, goal: 'Reducir grasa corporal' };
  assert.equal(bmiFor(pregnant), 0);
  const current = selectCurrent(pregnant);
  const target = selectTarget(pregnant, current);
  assert.equal(current.bmi, 0);
  assert.equal(current.frame, null);
  assert.equal(current.category, 'neutral');
  assert.equal(target.bmi, 0);
  assert.equal(target.frame, null);
});
