import jsYaml from 'js-yaml';
export default function plugin(frontmatter) {
  return function transform(tree, vFile) {
    tree.children.unshift({
      type: 'yaml',
      value: jsYaml.dump(frontmatter)
    });
  };
}