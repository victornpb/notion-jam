
/*!
 * Unit tests
 * @see https://jsfiddle.net/Victornpb/80sgj5rx/
 */


function toCamelCase(str) {
  return tokenize(str).map((piece, i) => i > 0 ? piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase() : piece.toLowerCase()).join('');
}

function toPascalCase(str) {
  return tokenize(str).map(piece => piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()).join('');
}

function toKebabCase(str) {
  return tokenize(str).join('-').toLowerCase();
}

function toSnakeCase(str) {
  return tokenize(str).join('_').toLowerCase();
}

function tokenize(str) {
  return str.trim().match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
}

const caseTransforms = {
  camel: toCamelCase,
  pascal: toPascalCase,
  kebab: toKebabCase,
  snake: toSnakeCase,
  none: str => str,
};

export function convertPropsCase(obj, caseType) {
  const toCase = caseTransforms[caseType];
  if (!toCase) throw new Error(`Unknown case type: ${caseType}! Valid values are: ${Object.keys(caseTransforms)}`);

  const newObj = {};
  for (const prop of Object.keys(obj)) {
    newObj[toCase(prop)] = obj[prop];
  }
  return newObj;
}