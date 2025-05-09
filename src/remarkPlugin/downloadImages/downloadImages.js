import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { visit } from 'unist-util-visit';
import defaults from 'default-args';
import jsYaml from 'js-yaml';

import parallel from '../../utils/parallel.js';
import hashFilename from './hashFilename.js';
import {
  urlWithoutQuery,
  isUrl,
  hasImageExtension,
  isImage,
  getSize,
} from './imageUtils.js';


export default function plugin(options) {

  options = defaults({
    concurrency: 1,
    outDir: './',
    markdownPath: '',

    maxFileSize: Infinity,
    skipDownloaded: false,
    downloadFrontmatterImages: true,
    timeout: 30,
  }, options);

  return async function transform(tree, vfile) {

    const imageNodes = [];

    // find frontmatter node and get images
    visit(tree, 'yaml', async node => {

      // parse frontmatter
      const parsedFrontmatter = jsYaml.load(node.value);
      const updateFrontmatter = () => node.value = jsYaml.dump(parsedFrontmatter);

      // create a proxy object watching for changes to the parsed frontmatter,
      // update the serialized value when changes occur
      const proxy = new Proxy(parsedFrontmatter, {
        set(target, key, value) {
          target[key] = value;
          updateFrontmatter();
          return true;
        }
      });

      function fakeImgNode(obj, key) {
        return {
          type: 'frontmatter-image',
          get url() { return obj[key]; },
          set url(value) { obj[key] = value; },
        };
      }

      // find image urls inside the frontmatter
      for (const [key, value] of Object.entries(parsedFrontmatter)) {
        if (isUrl(value)) {
          imageNodes.push(fakeImgNode(proxy, key));
        }
      }
    });


    // find images with remote urls
    visit(tree, 'image', async node => {
      const { url, position } = node;
      if (isUrl(url) === false) return;

      try {
        new URL(url);
      } catch (error) {
        return vfile.message(`Invalid URL: ${url}`, position, url);
      }
      imageNodes.push(node);
    });

    await parallel(imageNodes, async (node) => {
      const { url, position } = node;

      // create a unique filename that is stable across different runs
      const imageFilename = hashFilename(urlWithoutQuery(url));

      // resolve paths
      let assetDir;
      let assetFilePath;
      let markdownFolder = path.dirname(options.markdownPath);
      if (options.outDir.startsWith('.')) {
        // assetPath is relative to the markdown file
        assetDir = path.join(markdownFolder, options.outDir);
        assetFilePath = path.join(assetDir, imageFilename);
      }
      else {
        // assetPath is relative to the cwd
        assetDir = path.join(options.outDir);
        assetFilePath = path.join(assetDir, imageFilename);
      }

      let result;
      if (options.skipDownloaded && fs.existsSync(assetFilePath)) {
        // skip downloading file already exists
        // console.log(`Skipping ${url}`);
        result = true;
      }
      else {

        await fs.promises.mkdir(assetDir, { recursive: true });

        // download image
        try {
          result = await downloadImage(url, assetFilePath, {
            maxFileSize: options.maxFileSize,
            timeout: options.timeout * 1000,
          });
          // console.log(`Downloaded ${url}`);
        }
        catch (error) {
          console.error(`Failed to download ${url}: ${error.message}`);
          vfile.message(error.message, position, url);
        }
      }

      if (result) {
        // rewrite ![image](url) with the local path
        const src = options.outDir.startsWith('.') ? './' + path.relative(markdownFolder, assetFilePath) : assetFilePath;
        node.url = src;
      }
    }, options.concurrency);

  };
}


function downloadImage(url, targetPath, { timeout = 1000 * 30, maxFileSize = Infinity }) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const httpRequest = parsedUrl.protocol === 'https:' ? https : http;

    const req = httpRequest.get(url, { timeout: timeout }, res => {
      const headers = res.headers;
      const statusCode = res.statusCode;

      let error;

      const fileSize = getSize(headers);
      if (statusCode === 200 && isImage(headers) && fileSize <= maxFileSize) {
        // write file to disk as stream
        res.pipe(fs.createWriteStream(targetPath));
        res.on('close', e => {
          resolve({
            filePath: targetPath,
            fileSize: fileSize,
            type: headers['content-type'],
            url,
          });
        });
      }
      else {
        if (statusCode !== 200) {
          error = new Error(`Received HTTP${statusCode} for: ${url}`);
        } else if (!isImage(headers)) {
          error = new Error(`Content-Type of ${url} is not an image/ type`);
        } else if (fileSize > maxFileSize) {
          error = new Error(`File at ${url} weighs ${headers['content-length']}, max size is ${maxFileSize}`);
        }

        req.destroy();
        res.resume();
        reject(error);
        return;
      }
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request for ${url} timed out`));
    });

    req.on('error', error => {
      req.destroy(error);
      reject(error);
    });
  });
}
