import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

import injectFrontmatterPlugin from '../remarkPlugin/injectFrontmatter.js';
import downloadImgPlugin from '../remarkPlugin/downloadImages/downloadImages.js';
import thumbnailDetectorPlugin from '../remarkPlugin/thumbnailDetector.js';

export async function transformMd({ markdown, article, articlePath, assetsPath }, options) {

  // create frontmatter
  const frontmatter = {
    ...article,
  };
  delete frontmatter.content;
  delete frontmatter.markdown;

  // parse markdown, add frontmatter, download images, and stringify
  const vFile = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(injectFrontmatterPlugin, frontmatter)
    .use(downloadImgPlugin, {
      outDir: assetsPath, // where to save images
      markdownPath: articlePath, // used to resolve relative image paths
      concurrency: options.parallelDownloadsPerPage, // number of concurrent downloads
      skipDownloaded: options.skipDownloadedImages, // skip downloading files already exist
      downloadFrontmatterImages: options.downloadFrontmatterImages, // download images in frontmatter
      timeout: options.downloadImageTimeout, // timeout in milliseconds
      maxFileSize: Infinity, // max file size in bytes
    })
    .use(thumbnailDetectorPlugin)
    .use(remarkStringify)
    .process(markdown);

  return vFile.toString(); // the new markdown string
}
