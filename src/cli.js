import dotenv from 'dotenv';
dotenv.config();

import run from './notionJam/index.js';

async function main() {
  try {
    run({
      notionSecret: process.env.NOTION_SECRET,
      notionDatabase: process.env.NOTION_DATABASE,
      articlePath: process.env.ARTICLE_PATH,
      assetsPath: process.env.ASSETS_PATH,
      parallelPages: process.env.PARALLEL_PAGES,
      parallelDownloadsPerPage: process.env.PARALLEL_DOWNLOADS_PER_PAGE,
      downloadImageTimeout: process.env.DOWNLOAD_IMAGE_TIMEOUT,
      skipDownloadedImages: process.env.SKIP_DOWNLOADED_IMAGES,
    });
  } catch (error) {
    console.error(error);
  }
}
main();