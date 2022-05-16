import jsYaml from 'js-yaml';
import { visit } from 'unist-util-visit';

export default function plugin(frontmatter) {
  return function transform(tree, vFile) {

    let frontmatterNode;
    visit(tree, 'yaml', async node => {
      frontmatterNode = node;
    });

    if (frontmatterNode) {

      const bodyImages = [];
      visit(tree, 'image', async node => {
        bodyImages.push(node.url);
      });

      const frontmatter = jsYaml.load(frontmatterNode.value);
      if (frontmatter.thumb === 'cover') frontmatter._thumbnail = frontmatter.cover_image;
      else if (frontmatter.thumb === 'icon') frontmatter._thumbnail = frontmatter.icon_image;
      else if (frontmatter.thumb === 'first') frontmatter._thumbnail = bodyImages[0];
      else if (/^\d+$/.test(frontmatter.thumb)) frontmatter._thumbnail = bodyImages[parseInt(frontmatter.thumb)+1];
      else frontmatter._thumbnail = frontmatter[frontmatter.thumb] || frontmatter.cover_image || bodyImages[0] || frontmatter.icon_image;

      // update frontmatter
      frontmatterNode.value = jsYaml.dump(frontmatter);
    }
    else throw new Error('No frontmatter found');
  };
}