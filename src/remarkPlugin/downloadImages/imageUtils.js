import path from 'path';

export function isUrl(url) {
  return /^https?:\/\//.test(url);
}

export function urlWithoutQuery(url) {
  const parsedURI = new URL(url);
  return new URL(parsedURI.pathname, parsedURI.href).href;
}

export function hasImageExtension(url) {
  const parsedURI = new URL(url);
  const ext = path.extname(parsedURI.pathname);
  return ['.png','.jpg','.jpeg','.gif','.svg','.webp'].includes(ext);
}

export function isImage(headers) {
  return headers['content-type'].startsWith('image/');
}

export function getSize(headers = {}) {
  return parseInt(headers['content-length'] || headers['Content-Length']) || 0;
}
