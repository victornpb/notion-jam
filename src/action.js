import * as core from '@actions/core';
import * as github from '@actions/github';
import run from './notionJam/index.js';

async function main() {
  try {
    core.info(`context event: ${github.context.eventName}`);
    core.info(`context action: ${github.context.action}`);
    core.info(`payload action: ${github.context.payload.action}`);

    await run({
      dir: process.env.DIR,
      notionApiSecret: core.getInput('NOTION_API_SECRET', { required: true }),
      notionDatabase: core.getInput('NOTION_DATABASE', { required: true }),
      parallelPages: core.getInput('PARALLEL_PAGES'),
      parallelDownloadsPerPage: core.getInput('PARALLEL_DOWNLOADS_PER_PAGE'),
      downloadImageTimeout: core.getInput('DOWNLOAD_IMAGE_TIMEOUT'),
      skipDownloadedImages: core.getInput('SKIP_DOWNLOADED_IMAGES'),
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}
main();
