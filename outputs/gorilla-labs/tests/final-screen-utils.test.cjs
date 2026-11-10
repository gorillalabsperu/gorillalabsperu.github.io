const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const { verifyPngBlob, buildAdvisorMessage, getCommunityInviteUrl, showPregnancyQuestion, isPregnant, createDownloadState } = require('../final-screen-utils.js');

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const value of buffer) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, content) {
  const kind = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(content.length, 0);
  const checksumInput = Buffer.concat([kind, content]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(checksumInput), 0);
  return Buffer.concat([length, checksumInput, checksum]);
}

function pngBlob(width, height, includeImageData = true) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const chunks = [pngChunk('IHDR', header)];
  if (includeImageData) {
    const rawPixels = Buffer.alloc((width * 4 + 1) * height);
    chunks.push(pngChunk('IDAT', zlib.deflateSync(rawPixels)));
  }
  chunks.push(pngChunk('IEND', Buffer.alloc(0)));
  return new Blob([signature, ...chunks], { type: 'image/png' });
}

test('valida PNG completo de 1080 px y conserva la altura dinámica', async () => {
  const blob = pngBlob(1080, 2637);
  assert.equal(await verifyPngBlob(blob, 1080, 2637), blob);
});

test('rechaza imagen incompleta o con tamaño diferente al canvas', async () => {
  await assert.rejects(() => verifyPngBlob(new Blob(['no es png'], { type: 'image/png' }), 1080, 900), /invalid PNG/);
  await assert.rejects(() => verifyPngBlob(pngBlob(1080, 1, false), 1080, 1), /invalid PNG|incomplete PNG/);
  await assert.rejects(() => verifyPngBlob(pngBlob(900, 1), 1080, 1), /unexpected PNG dimensions/);
  const truncated = pngBlob(1080, 1);
  await assert.rejects(() => verifyPngBlob(truncated.slice(0, truncated.size - 3, 'image/png'), 1080, 1), /incomplete PNG/);
  const corruptedBytes = Buffer.from(await pngBlob(1080, 1).arrayBuffer());
  corruptedBytes[32] ^= 1;
  await assert.rejects(() => verifyPngBlob(new Blob([corruptedBytes], { type: 'image/png' }), 1080, 1), /checksum/);
});

test('mensaje de WhatsApp solo incluye el nombre y pide adjuntar manualmente la ficha', () => {
  const message = buildAdvisorMessage('Alexa   Ríos');
  assert.match(message, /Hola, soy Alexa Ríos/);
  assert.match(message, /Adjuntaré mi ficha PNG manualmente/);
  assert.doesNotMatch(message, /años|objetivo|estatura|peso|alergias|antecedentes|suplementos/i);
});

test('solo habilita enlaces HTTPS oficiales de invitación de WhatsApp', () => {
  assert.equal(getCommunityInviteUrl({ whatsappInviteUrl: '' }), '');
  assert.equal(getCommunityInviteUrl({ whatsappInviteUrl: 'https://example.com/invite' }), '');
  assert.equal(getCommunityInviteUrl({ whatsappInviteUrl: 'http://chat.whatsapp.com/example' }), '');
  assert.equal(getCommunityInviteUrl({ whatsappInviteUrl: 'https://chat.whatsapp.com/AbCd1234' }), 'https://chat.whatsapp.com/AbCd1234');
});

test('la pregunta de embarazo solo aparece para mujeres y la ruta especial solo se activa con Sí', () => {
  assert.equal(showPregnancyQuestion({ sex: 'Hombre' }), false);
  assert.equal(showPregnancyQuestion({ sex: 'Mujer' }), true);
  assert.equal(isPregnant({ sex: 'Mujer', pregnancyStatus: 'No' }), false);
  assert.equal(isPregnant({ sex: 'Mujer', pregnancyStatus: 'Sí' }), true);
  assert.equal(isPregnant({ sex: 'Hombre', pregnancyStatus: 'Sí' }), false);
});

test('bloquea el envío al asesor hasta verificar el PNG e iniciar su descarga', () => {
  const state = createDownloadState();
  assert.equal(state.canSendToAdvisor(), false);
  assert.equal(state.markDownloadStarted(), false);
  state.markPngVerified();
  assert.equal(state.canSendToAdvisor(), false);
  assert.equal(state.markDownloadStarted(), true);
  assert.equal(state.canSendToAdvisor(), true);
});
