import dotenv from 'dotenv';
dotenv.config();

import run from './notionJam/index.js';

async function main() {
  try {
    await run({
      notionSecret: process.env.NOTION_SECRET,
      notionDatabase: process.env.NOTION_DATABASE,
      filterProp: process.env.FILTER_PROP,
      filterType: process.env.FILTER_TYPE,
      filterValues: process.env.FILTER_VALUES,
      caseType: process.env.CONVERT_PROP_CASE,
      articlePath: process.env.ARTICLE_PATH,
      assetsPath: process.env.ASSETS_PATH,
      parallelPages: process.env.PARALLEL_PAGES,
      parallelDownloadsPerPage: process.env.PARALLEL_DOWNLOADS_PER_PAGE,
      downloadImageTimeout: process.env.DOWNLOAD_IMAGE_TIMEOUT,
      skipDownloadedImages: process.env.SKIP_DOWNLOADED_IMAGES,
      downloadFrontmatterImages: process.env.DOWNLOAD_FRONTMATTER_IMAGES,
      should_ignore_filters: Boolean(process.env.SHOULD_IGNORE_FILTERS),
    });
  } catch (error) {
    console.error(error);
  }
}
main();
