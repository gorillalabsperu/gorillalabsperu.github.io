const test = require('node:test');
const assert = require('node:assert/strict');
const zlib = require('node:zlib');
const { verifyPngBlob, createPdfBlobFromJpegBlob, verifyPdfBlob, buildAdvisorMessage, getCommunityInviteUrl, showPregnancyQuestion, isPregnant, createDownloadState } = require('../final-screen-utils.js');

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

function jpegBytes(width, height) {
  const segmentLength = 17;
  const frame = Buffer.from([
    0xff, 0xd8,
    0xff, 0xc0, 0x00, segmentLength,
    0x08, (height >>> 8) & 0xff, height & 0xff, (width >>> 8) & 0xff, width & 0xff, 0x03,
    0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
    0xff, 0xd9
  ]);
  const appPayload = Buffer.alloc(120);
  const appSegment = Buffer.concat([Buffer.from([0xff, 0xe0, 0x00, 0x7a]), appPayload]);
  return Buffer.concat([frame.subarray(0, 2), appSegment, frame.subarray(2)]);
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

test('genera y verifica un PDF completo con la proporción y dimensiones de la ficha', async () => {
  const blob = new Blob([jpegBytes(1080, 2637)], { type: 'image/jpeg' });
  const pdf = await createPdfBlobFromJpegBlob(blob, 1080, 2637);
  assert.equal(pdf.type, 'application/pdf');
  assert.equal(await verifyPdfBlob(pdf, 1080, 2637), pdf);
  const bytes = Buffer.from(await pdf.arrayBuffer());
  assert.equal(bytes.subarray(0, 8).toString('ascii'), '%PDF-1.4');
  assert.match(bytes.toString('latin1'), /\/MediaBox \[0 0 595\.28 1453\.\d+\]/);
  assert.match(bytes.toString('latin1'), /\/Width 1080 \/Height 2637/);
  await assert.rejects(() => createPdfBlobFromJpegBlob(blob, 1080, 2600), /unexpected JPEG dimensions/);
  await assert.rejects(() => verifyPdfBlob(new Blob(['not pdf'], { type: 'application/pdf' })), /invalid PDF/);
});

test('mensaje de WhatsApp solo incluye el nombre y pide adjuntar manualmente la ficha', () => {
  const message = buildAdvisorMessage('Alexa   Ríos');
  assert.match(message, /Hola, soy Alexa Ríos/);
  assert.match(message, /Adjuntaré mi ficha manualmente/);
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

test('bloquea el envío al asesor hasta verificar la ficha e iniciar su descarga', () => {
  const state = createDownloadState();
  assert.equal(state.canSendToAdvisor(), false);
  assert.equal(state.markDownloadStarted(), false);
  state.markFileVerified();
  assert.equal(state.canSendToAdvisor(), false);
  assert.equal(state.markDownloadStarted(), true);
  assert.equal(state.canSendToAdvisor(), true);
});
