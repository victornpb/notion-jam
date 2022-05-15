
/**
 * Replace all {key} placeholders in a string with the corresponding value from an object array or list of argumments.
 * @param {string} str The string template.
 * @param {object|array} args The object containing the values to replace the tokens with.
 * @param {function} [replacer] A function that can be used to modify the value before it is used.
 * @returns {string} The new string with the tokens replaced.
 * @author victornpb https://gist.github.com/victornpb/5a9642b1d5f749695e14
 *
 * @example
 * format("hello {0} world {1}!", "foo", "bar"); //"hello foo world bar"
 * format("hello {0} world {1}!", ["foo", "bar"]); //"hello foo world bar"
 * format("hello {name} world {test}!", {name: "foo", test: "bar"}); //"hello foo world bar"
 * format("hello {obj.name} world {obj.test[0]}!", {obj:{name: "foo", test: ["bar"]}}); //"hello foo world bar"
 */
export default function format(string, args, replacer) {
  const useReplacer = typeof replacer === 'function';
  return String(string).replace(/\{([^}]+)\}/g, (m, key) => {
    let val = getDeepVal(args, key, useReplacer ? null : m);
    if (useReplacer) val = replacer(val, key, m, args);
    return val;
  });
}


/**
 * Access a deep value inside an object
 * Works by passing a path like "foo.bar", also works with nested arrays like "foo[0][1].baz"
 * @author Victor B. https://gist.github.com/victornpb/4c7882c1b9d36292308e
 * Unit tests: http://jsfiddle.net/Victornpb/0u1qygrh/
 * @param {any} object Any object
 * @param {string} path Property path to access e.g.: "foo.bar[0].baz.1.a.b"
 * @param {any} [defaultValue=undefined] Optional value to return when property doesn't exist or is undefined
 * @return {any}
 */
function getDeepVal(object, path, defaultValue = undefined) {
  if (typeof object === 'undefined' || object === null) return defaultValue;
  const pathArray = path.split(/\.|\[["']?|["']?\]/);
  for (let i = 0, l = pathArray.length; i < l; i++) {
    if (pathArray[i] === '') continue;
    object = object[pathArray[i]];
    if (typeof object === 'undefined' || object === null) return defaultValue;
  }
  return (typeof object === 'undefined' || object === null) ? defaultValue : object;
}