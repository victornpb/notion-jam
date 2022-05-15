import * as core from '@actions/core';
import * as github from '@actions/github';
import run from './notionJam/index.js';

async function main() {
  try {
    core.info(`context event: ${github.context.eventName}`);
    core.info(`context action: ${github.context.action}`);
    core.info(`payload action: ${github.context.payload.action}`);

    await run({
      notionSecret: core.getInput('NOTION_SECRET', { required: true }),
      notionDatabase: core.getInput('NOTION_DATABASE', { required: true }),
      filterProp: core.getInput('FILTER_PROP'),
      filterValues: core.getInput('FILTER_VALUES'),
      caseType: core.getInput('CONVERT_PROP_CASE'),
      articlePath: core.getInput('ARTICLE_PATH'),
      assetsPath: core.getInput('ASSETS_PATH'),
      parallelPages: core.getInput('PARALLEL_PAGES'),
      parallelDownloadsPerPage: core.getInput('PARALLEL_DOWNLOADS_PER_PAGE'),
      downloadImageTimeout: core.getInput('DOWNLOAD_IMAGE_TIMEOUT'),
      skipDownloadedImages: core.getInput('SKIP_DOWNLOADED_IMAGES'),
      downloadFrontmatterImages: core.getInput('DOWNLOAD_FRONTMATTER_IMAGES'),
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}
main();
