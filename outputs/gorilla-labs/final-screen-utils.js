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

  function asBytes(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    throw new Error('invalid JPEG data');
  }

  function readJpegDimensions(value) {
    const bytes = asBytes(value);
    if (bytes.length < 12 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
      throw new Error('invalid JPEG file');
    }
    const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    let offset = 2;
    while (offset < bytes.length - 2) {
      if (bytes[offset] !== 0xff) throw new Error('invalid JPEG marker');
      while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > bytes.length) throw new Error('incomplete JPEG segment');
      const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
      if (segmentLength < 2 || offset + segmentLength > bytes.length) throw new Error('incomplete JPEG segment');
      if (frameMarkers.has(marker)) {
        if (segmentLength < 8) throw new Error('invalid JPEG frame');
        const height = (bytes[offset + 3] << 8) | bytes[offset + 4];
        const width = (bytes[offset + 5] << 8) | bytes[offset + 6];
        if (!width || !height) throw new Error('invalid JPEG dimensions');
        return { width: width, height: height };
      }
      offset += segmentLength;
    }
    throw new Error('JPEG dimensions not found');
  }

  function pdfAscii(value) {
    const text = String(value);
    const bytes = new Uint8Array(text.length);
    for (let index = 0; index < text.length; index += 1) bytes[index] = text.charCodeAt(index) & 0xff;
    return bytes;
  }

  function buildPdfFromJpegBytes(jpegValue, width, height) {
    const jpegBytes = asBytes(jpegValue);
    const dimensions = readJpegDimensions(jpegBytes);
    if (dimensions.width !== width || dimensions.height !== height) throw new Error('JPEG dimensions mismatch');
    const pageWidth = 595.28;
    const pageHeight = Number((pageWidth * height / width).toFixed(2));
    const parts = [];
    const offsets = new Array(6).fill(0);
    let byteLength = 0;
    function append(value) {
      const bytes = typeof value === 'string' ? pdfAscii(value) : value;
      parts.push(bytes);
      byteLength += bytes.length;
    }
    function startObject(number) {
      offsets[number] = byteLength;
      append(number + ' 0 obj\n');
    }
    append('%PDF-1.4\n% Gorilla Labs ficha\n');
    startObject(1);
    append('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    startObject(2);
    append('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    startObject(3);
    append('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pageWidth + ' ' + pageHeight + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
    startObject(4);
    append('<< /Type /XObject /Subtype /Image /Width ' + width + ' /Height ' + height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>\nstream\n');
    append(jpegBytes);
    append('\nendstream\nendobj\n');
    const content = pdfAscii('q\n' + pageWidth + ' 0 0 ' + pageHeight + ' 0 0 cm\n/Im0 Do\nQ\n');
    startObject(5);
    append('<< /Length ' + content.length + ' >>\nstream\n');
    append(content);
    append('endstream\nendobj\n');
    const xrefOffset = byteLength;
    append('xref\n0 6\n0000000000 65535 f \n');
    for (let number = 1; number <= 5; number += 1) append(String(offsets[number]).padStart(10, '0') + ' 00000 n \n');
    append('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n');
    const output = new Uint8Array(byteLength);
    let outputOffset = 0;
    parts.forEach(function (part) { output.set(part, outputOffset); outputOffset += part.length; });
    return output;
  }

  async function createPdfBlobFromJpegBlob(blob, expectedWidth, expectedHeight) {
    if (!blob || blob.type !== 'image/jpeg' || typeof blob.arrayBuffer !== 'function' || blob.size < 100) throw new Error('invalid JPEG blob');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const dimensions = readJpegDimensions(bytes);
    if (dimensions.width !== expectedWidth || dimensions.height !== expectedHeight) throw new Error('unexpected JPEG dimensions');
    const pdfBytes = buildPdfFromJpegBytes(bytes, dimensions.width, dimensions.height);
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }

  function decodeLatin1(bytes, start, end) {
    let result = '';
    const chunkSize = 8192;
    for (let offset = start; offset < end; offset += chunkSize) {
      result += String.fromCharCode.apply(null, bytes.subarray(offset, Math.min(offset + chunkSize, end)));
    }
    return result;
  }

  async function verifyPdfBlob(blob, expectedWidth, expectedHeight) {
    if (!blob || blob.type !== 'application/pdf' || typeof blob.arrayBuffer !== 'function' || blob.size < 160) throw new Error('invalid PDF blob');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (decodeLatin1(bytes, 0, Math.min(bytes.length, 8)) !== '%PDF-1.4') throw new Error('invalid PDF header');
    const tail = decodeLatin1(bytes, Math.max(0, bytes.length - 128), bytes.length);
    if (!/startxref\s+\d+\s+%%EOF\s*$/.test(tail)) throw new Error('incomplete PDF file');
    const header = decodeLatin1(bytes, 0, Math.min(bytes.length, 4096));
    if (!header.includes('/Type /Catalog') || !header.includes('/Type /Pages') || !header.includes('/Type /Page ') || !header.includes('/Subtype /Image') || !header.includes('/Filter /DCTDecode')) {
      throw new Error('incomplete PDF content');
    }
    if (expectedWidth && expectedHeight && (!header.includes('/Width ' + expectedWidth + ' /Height ' + expectedHeight) || !header.includes('/MediaBox [0 0 595.28 '))) {
      throw new Error('PDF report dimensions mismatch');
    }
    const xrefMatch = tail.match(/startxref\s+(\d+)\s+%%EOF\s*$/);
    const xrefOffset = xrefMatch ? Number(xrefMatch[1]) : -1;
    if (xrefOffset < 0 || decodeLatin1(bytes, xrefOffset, Math.min(bytes.length, xrefOffset + 9)) !== 'xref\n0 6\n') throw new Error('invalid PDF cross-reference table');
    const xrefLines = decodeLatin1(bytes, xrefOffset, Math.min(bytes.length, xrefOffset + 256)).split('\n');
    for (let number = 1; number <= 5; number += 1) {
      const row = xrefLines[number + 2];
      const objectOffset = row ? Number(row.slice(0, 10)) : NaN;
      if (!Number.isInteger(objectOffset) || decodeLatin1(bytes, objectOffset, objectOffset + 7) !== number + ' 0 obj') throw new Error('invalid PDF object offset');
    }
    return blob;
  }

  function buildAdvisorMessage(name) {
    const firstName = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 100) || 'cliente';
    return 'Hola, soy ' + firstName + '. Ya completé mi ficha de Gorilla Labs y quiero coordinar una evaluación. Adjuntaré mi ficha manualmente en este chat.';
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
    let fileVerified = false;
    let downloadStarted = false;
    return {
      markFileVerified: function () { fileVerified = true; },
      markPngVerified: function () { fileVerified = true; },
      markDownloadStarted: function () {
        if (!fileVerified) return false;
        downloadStarted = true;
        return true;
      },
      canSendToAdvisor: function () { return downloadStarted; }
    };
  }

  return {
    verifyPngBlob: verifyPngBlob,
    readJpegDimensions: readJpegDimensions,
    createPdfBlobFromJpegBlob: createPdfBlobFromJpegBlob,
    verifyPdfBlob: verifyPdfBlob,
    buildAdvisorMessage: buildAdvisorMessage,
    getCommunityInviteUrl: getCommunityInviteUrl,
    showPregnancyQuestion: showPregnancyQuestion,
    isPregnant: isPregnant,
    createDownloadState: createDownloadState
  };
});
