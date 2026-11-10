(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.GorillaFinalScreenUtils = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';

  const signature = [137, 80, 78, 71, 13, 10, 26, 10];

  function pngCrc32(bytes, start, end) {
    let crc = 0xffffffff;
    for (let index = start; index < end; index++) {
      crc ^= bytes[index];
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  async function decodePng(blob, expectedWidth, expectedHeight) {
    if (root && typeof root.createImageBitmap === 'function') {
      const bitmap = await root.createImageBitmap(blob);
      try {
        if (bitmap.width !== expectedWidth || bitmap.height !== expectedHeight) throw new Error('PNG decode dimensions mismatch');
      } finally {
        if (typeof bitmap.close === 'function') bitmap.close();
      }
      return;
    }
    if (!root || typeof root.Image !== 'function' || !root.URL || typeof root.URL.createObjectURL !== 'function') return;
    const url = root.URL.createObjectURL(blob);
    try {
      const image = await new Promise(function (resolve, reject) {
        const element = new root.Image();
        element.onload = function () { resolve(element); };
        element.onerror = function () { reject(new Error('PNG decode failed')); };
        element.src = url;
      });
      if (image.naturalWidth !== expectedWidth || image.naturalHeight !== expectedHeight) throw new Error('PNG decode dimensions mismatch');
    } finally {
      root.URL.revokeObjectURL(url);
    }
  }

  async function verifyPngBlob(blob, expectedWidth, expectedHeight) {
    if (!blob || blob.type !== 'image/png' || blob.size < 57 || typeof blob.arrayBuffer !== 'function') {
      throw new Error('invalid PNG blob');
    }
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes.length < 57 || signature.some(function (byte, index) { return bytes[index] !== byte; })) {
      throw new Error('invalid PNG signature');
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 8, width = 0, height = 0, hasHeader = false, hasData = false, hasEnd = false;
    while (offset < bytes.length) {
      if (offset + 12 > bytes.length) throw new Error('incomplete PNG chunk');
      const length = view.getUint32(offset, false);
      const chunkEnd = offset + 12 + length;
      if (chunkEnd > bytes.length) throw new Error('incomplete PNG chunk');
      const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
      const expectedCrc = view.getUint32(offset + 8 + length, false);
      if (pngCrc32(bytes, offset + 4, offset + 8 + length) !== expectedCrc) throw new Error('PNG checksum mismatch');
      if (!hasHeader) {
        if (type !== 'IHDR' || length !== 13) throw new Error('invalid PNG header');
        width = view.getUint32(offset + 8, false);
        height = view.getUint32(offset + 12, false);
        hasHeader = true;
      } else if (type === 'IHDR') {
        throw new Error('duplicate PNG header');
      }
      if (type === 'IDAT') hasData = true;
      if (type === 'IEND') {
        if (length !== 0 || chunkEnd !== bytes.length) throw new Error('invalid PNG end');
        hasEnd = true;
        offset = chunkEnd;
        break;
      }
      offset = chunkEnd;
    }
    if (!hasHeader || !hasData || !hasEnd) throw new Error('incomplete PNG file');
    if (width !== 1080 || width !== expectedWidth || height < 1 || height !== expectedHeight) {
      throw new Error('unexpected PNG dimensions');
    }
    await decodePng(blob, width, height);
    return blob;
  }

  function buildAdvisorMessage(name) {
    const firstName = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 100) || 'cliente';
    return 'Hola, soy ' + firstName + '. Ya completé mi ficha de Gorilla Labs y quiero coordinar una evaluación. Adjuntaré mi ficha PNG manualmente en este chat.';
  }

  function getCommunityInviteUrl(config) {
    const value = config && config.whatsappInviteUrl;
    if (!value) return '';
    try {
      const invite = new URL(String(value));
      if (invite.protocol !== 'https:' || invite.hostname.toLowerCase() !== 'chat.whatsapp.com' || invite.pathname.length < 2) return '';
      return invite.href;
    } catch (_) {
      return '';
    }
  }

  function showPregnancyQuestion(profile) {
    return !!profile && profile.sex === 'Mujer';
  }

  function isPregnant(profile) {
    return showPregnancyQuestion(profile) && profile.pregnancyStatus === 'Sí';
  }

  function createDownloadState() {
    let pngVerified = false;
    let downloadStarted = false;
    return {
      markPngVerified: function () { pngVerified = true; },
      markDownloadStarted: function () {
        if (!pngVerified) return false;
        downloadStarted = true;
        return true;
      },
      canSendToAdvisor: function () { return downloadStarted; }
    };
  }

  return {
    verifyPngBlob: verifyPngBlob,
    buildAdvisorMessage: buildAdvisorMessage,
    getCommunityInviteUrl: getCommunityInviteUrl,
    showPregnancyQuestion: showPregnancyQuestion,
    isPregnant: isPregnant,
    createDownloadState: createDownloadState
  };
});
