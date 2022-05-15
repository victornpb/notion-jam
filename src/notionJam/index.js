import fs from 'fs';
import path from 'path';
import defaults from 'default-args';

import { NotionModule } from './notion.js';
import { transformMd } from './transformMarkdown.js';
import parallel from '../utils/parallel.js';


export default async function run(options) {
  console.time('run');

  options = defaults({
    notionSecret: undefined,
    notionDatabase: undefined,

    parallelPages: 3,
    parallelDownloadsPerPage: 3,
    downloadImageTimeout: 1000 * 30,
    skipDownloadedImages: true,
    dir: './posts',
  }, options);

  const notionModule = new NotionModule({
    secret: options.notionSecret,
    database: options.notionDatabase,
  });

  console.log('Fetching pages...');
  const pages = await notionModule.fetchArticles();
  console.log(`Found ${pages.length} pages`);
  await parallel(pages, async (page) => {

    const article = await notionModule.getArticle(page);

    const folderName = article.title.replace(/[^A-z0-9_]/g, '-').toLowerCase();
    const dirPath = path.join(options.dir, folderName);
    const filePath = path.join(dirPath, '/index.md');
    await fs.promises.mkdir(dirPath, { recursive: true });

    // transform markdown
    article.markdown = await transformMd({
      markdown: article.content,
      article,
      filePath,
    }, options);

    // save markdown to disk
    await fs.promises.writeFile(filePath, article.markdown, 'utf8');

    console.log(`Created '${filePath}' from "${article.title}" (${article.id})`);
  }, options.parallelPages);

  console.log('Done!');
  console.timeEnd('run');
}
