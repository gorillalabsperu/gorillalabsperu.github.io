const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate, referenceSummary, waterReference } = require('../nutrition-balance.js');

function byKey(results, key) {
  return results.find((result) => result.key === key);
}

test('las respuestas de frecuencia del formulario no se convierten en porcentajes inventados', () => {
  const low = calculate({
    age: 28, protein: 'Casi nunca', animalProteinFrequency: 'Rara vez o nunca',
    fishFrequency: 'Rara vez o nunca', legumeFrequency: 'Rara vez o nunca',
    fruitFrequency: 'Rara vez o nunca', vegetableFrequency: 'Rara vez o nunca',
    processedFoodsFrequency: 'Rara vez o nunca', meals: '1 a 2', water: 'Menos de 1 litro'
  });
  const high = calculate({
    age: 28, protein: 'Sí, casi siempre', animalProteinFrequency: 'Diario',
    fishFrequency: 'Diario', legumeFrequency: 'Diario', fruitFrequency: 'Diario',
    vegetableFrequency: 'Diario', processedFoodsFrequency: 'Diario', meals: '4 o más', water: 'Más de 2 litros'
  });
  assert.equal(low.length, 4);
  assert.equal(high.length, 4);
  for (const result of [...low, ...high]) {
    assert.equal(result.percent, null);
    assert.equal(result.classification, 'INFORMACIÓN INSUFICIENTE');
  }
  assert.match(byKey(low, 'protein').detail, /casi nunca/i);
  assert.match(byKey(high, 'protein').detail, /Sí, casi siempre/);
  for (const key of ['protein', 'carbohydrates', 'fats', 'hydration']) {
    assert.notEqual(byKey(low, key).detail, byKey(high, key).detail, `la evidencia de ${key} debe reflejar las respuestas propias`);
  }
  assert.match(byKey(low, 'carbohydrates').detail, /1 a 2/);
  assert.match(byKey(high, 'carbohydrates').detail, /4 o más/);
  assert.match(byKey(low, 'fats').detail, /rara vez\/nunca/i);
  assert.match(byKey(high, 'fats').detail, /Diario/);
  assert.match(byKey(low, 'hydration').detail, /Menos de 1 litro/);
  assert.match(byKey(high, 'hydration').detail, /Más de 2 litros/);
});

test('calcula porcentajes energéticos y usa clasificación AMDR cuando hay gramos y kcal', () => {
  const results = calculate({ age: 28, totalEnergyKcal: 2000, proteinGrams: 125, carbohydrateGrams: 275, fatGrams: 55.56 });
  assert.deepEqual(['protein', 'carbohydrates', 'fats'].map((key) => byKey(results, key).percent), [25, 55, 25]);
  assert.deepEqual(['protein', 'carbohydrates', 'fats'].map((key) => byKey(results, key).classification), ['MODERADO', 'MODERADO', 'MODERADO']);
  assert.match(byKey(results, 'protein').reference, /10–35%/);
});

test('distingue proporciones fuera de los rangos de referencia sin llamarlas diagnósticos', () => {
  const results = calculate({ age: 28, totalEnergyKcal: 2000, proteinGrams: 30, carbohydrateGrams: 150, fatGrams: 100 });
  assert.equal(byKey(results, 'protein').classification, 'BAJO');
  assert.equal(byKey(results, 'carbohydrates').classification, 'BAJO');
  assert.equal(byKey(results, 'fats').classification, 'ALTO');
  assert.equal(byKey(results, 'hydration').classification, 'INFORMACIÓN INSUFICIENTE');
});

test('usa el rango de referencia correspondiente a los 18 años', () => {
  const result = byKey(calculate({ age: 18, totalEnergyKcal: 2000, proteinGrams: 50, carbohydrateGrams: 900, fatGrams: 44.44 }), 'fats');
  assert.equal(result.percent, 20);
  assert.equal(result.classification, 'BAJO');
  assert.match(result.reference, /25–35%/);
});

test('si falta energía, edad o cantidad de un macronutriente deja ese cálculo sin puntuar', () => {
  const results = calculate({ age: 28, proteinGrams: 90, carbohydrateGrams: 200, fatGrams: 70 });
  for (const key of ['protein', 'carbohydrates', 'fats']) {
    assert.equal(byKey(results, key).percent, null);
    assert.equal(byKey(results, key).classification, 'INFORMACIÓN INSUFICIENTE');
  }
});

test('documenta AMDR por edad y la referencia de agua total sin presentar el intervalo como porcentaje', () => {
  assert.match(referenceSummary(18), /proteínas 10–30%.*carbohidratos 45–65%.*grasas 25–35%/);
  assert.match(referenceSummary(28), /proteínas 10–35%.*carbohidratos 45–65%.*grasas 20–35%/);
  assert.match(waterReference({ age: 18, sex: 'Mujer' }), /2\.3 L\/día/);
  assert.match(waterReference({ age: 18, sex: 'Hombre' }), /3\.3 L\/día/);
  assert.match(waterReference({ age: 28, sex: 'Mujer' }), /2\.7 L\/día/);
  assert.match(waterReference({ age: 28, sex: 'Hombre' }), /3\.7 L\/día/);
  assert.match(waterReference({ age: 28, sex: 'Mujer', pregnancyStatus: 'Sí' }), /evaluación personalizada/);
  assert.match(byKey(calculate({ age: 28, sex: 'Mujer', water: '1 a 2 litros' }), 'hydration').reference, /incluye alimentos y todas las bebidas/);
});
