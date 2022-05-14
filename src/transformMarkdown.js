import path from 'path';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";

import downloadImgPlugin from "./downloadImgPlugin.js";
import jsYaml from "js-yaml";
export async function transformMd(md, data, filePath) {

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
    const markdownFolder = path.dirname(filePath);
    const vFile = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(injectFrontmatter)
        .use(downloadImgPlugin, {
            outDir: markdownFolder, // where to save images
            concurrency: 1, // number of concurrent downloads
            maxFileSize: Infinity, // max file size in bytes
            skipDownloaded: true, // skip downloading files already exist
            timeout: 1000 * 30, // timeout in milliseconds
        })
        .use(remarkStringify)
        .process(md);
    
    const markdown = String(vFile);
    return markdown;

}
