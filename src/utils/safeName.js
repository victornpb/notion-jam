export default function safeName(name) {
  return String(name).replace(/[^A-z0-9_]/g, '-').substring(0, 64);
}