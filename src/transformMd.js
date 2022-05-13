import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkImagesDownload from './aa/index.js';
import jsYaml from "js-yaml";
export async function transformMd(md, data, dir) {

    function injectFrontmatter() {
        return function (tree, vFile) {
            const frontmatter = {
                ...data,
            };

            delete frontmatter.content;
            delete frontmatter.markdown;

            tree.children.unshift({
                type: "yaml",
                value: jsYaml.dump(frontmatter)
            });
        }
    }

    // parse markdown, modify frontmatter, and stringify
    const r = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(injectFrontmatter)
        .use(remarkImagesDownload, {
            disabled: false,
            downloadDestination: dir,
            // defaultImagePath: 'black.png',
            defaultOn: {
              statusCode: true,
              mimeType: false,
              fileTooBig: false,
            },
            maxlength: 1000000,
            dirSizeLimit: 10000000,
            localUrlToLocalPath: (localUrl) => localPath
        })
        .use(remarkStringify)
        .process(md);
    
    const str = String(r);
    
    return str;

}
