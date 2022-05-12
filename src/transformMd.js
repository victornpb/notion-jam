import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
// import remarkYmlFrontmatter from "remark-parse-yaml";
import jsYaml from "js-yaml";
export async function transformMd(md, data) {

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
    const r = unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        // .use(remarkYmlFrontmatter)
        .use(injectFrontmatter)
        .use(remarkStringify)
        .processSync(md);
    
    const str = r.toString();
    
    return str;

}


// import {visit} from 'unist-util-visit'
