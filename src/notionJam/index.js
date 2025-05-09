import fs from 'fs';
import path from 'path';
import defaults from 'default-args';

import { NotionModule } from './notion.js';
import { transformMd } from './transformMarkdown.js';
import parallel from '../utils/parallel.js';
import safeName from '../utils/safeName.js';
import format from '../utils/format.js';
import { toBool, toInt } from '../utils/cast.js';


export default async function run(options) {
  console.time('run');

  options = defaults({
    notionSecret: undefined,
    notionDatabase: undefined,

    filterProp: 'Status',
    filterValues: 'Ready,Published',
    filterType: 'select',
    caseType: 'snake',

    parallelPages: 25,
    parallelDownloadsPerPage: 3,
    downloadImageTimeout: 30,
    skipDownloadedImages: true,
    articlePath: 'posts/{title}/index.md',
    assetsPath: '.', // relative to the markdown file if starts with '.', or absolute otherwise

    should_ignore_filters: false,
  }, options);

  options.parallelPages = toInt(options.parallelPages);
  options.parallelDownloadsPerPage = toInt(options.parallelDownloadsPerPage);
  options.downloadImageTimeout = toInt(options.downloadImageTimeout);
  options.skipDownloadedImages = toBool(options.skipDownloadedImages);

  const notionModule = new NotionModule({
    secret: options.notionSecret,
    database: options.notionDatabase,
  }, options);

  console.log('Fetching pages...');
  const pages = await notionModule.fetchArticles();
  console.log(`Found ${pages.length} pages`);
  await parallel(pages, async (page) => {

    const article = await notionModule.getArticle(page);

    const articlePath = format(options.articlePath, article, val => safeName(val));
    const assetsPath = format(options.assetsPath, article, val => safeName(val));

    // transform markdown
    article.markdown = await transformMd({
      markdown: article.content,
      article,
      articlePath: articlePath,
      assetsPath,
    }, options);

    // save markdown to disk
    await fs.promises.mkdir(path.dirname(articlePath), { recursive: true });
    await fs.promises.writeFile(articlePath, article.markdown, 'utf8');

    console.log(`Created '${articlePath}' from "${article.title}" (${article.id})`);
  }, options.parallelPages);

  console.log('Done!');
  console.timeEnd('run');
}
