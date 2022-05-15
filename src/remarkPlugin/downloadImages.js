import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { visit } from 'unist-util-visit';
import defaults from 'default-args';
import parallel from '../utils/parallel.js';

export default function plugin(options) {

  options = defaults({
    concurrency: 1,
    outDir: './',
    markdownPath: '',

    maxFileSize: Infinity,
    skipDownloaded: false,
    timeout: 30,
  }, options);

  return async function transform(tree, vfile) {

    const imageNodes = [];

    // find images with remote urls
    visit(tree, 'image', async node => {
      const { url, position } = node;
      if (!url.startsWith('http://') && !url.startsWith('https://')) return;

      try {
        new URL(url);
      } catch (error) {
        return vfile.message(`Invalid URL: ${url}`, position, url);
      }
      imageNodes.push(node);
    });

    await parallel(imageNodes, async (node) => {
      const { url, position } = node;

      const parsedURI = new URL(url);
      const urlWithoutQuery = new URL(parsedURI.pathname, parsedURI.href).href;

      // create a unique filename that is stable across different runs
      const imageFilename = hashFilename(urlWithoutQuery);

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

function isImage(headers) {
  return headers['content-type'].startsWith('image/');
}

function getSize(headers = {}) {
  return parseInt(headers['content-length'] || headers['Content-Length']) || 0;
}

/**
 * It takes a URL, creates a hash of the URL, and returns a new filename based on the original filename and the hash.
 * So if a document include 2 images with the same name but from different urls, the files will not get overwritten
 * when downloaded to the same folder, each image gets a different suffix hash based on the full URL.
 * @param url - The URL of the file to be downloaded.
 * @returns A new filename with the hash of the url appended to the end of the filename.
 * @author github.com/victornpb
 *
 * @example
 * hashFilename('https://foo.com/site-logo.png') // 'site-logo_tWQ82rOT.png'
 * hashFilename('https://bar.com/site-logo.png') // 'site-logo_azOmiCST.png'
 */
function hashFilename(url) {
  const hash = crypto.createHash('sha1').update(url).digest('base64').replace(/[+/=]/g, '').substring(0, 8);
  const parsedFilenane = path.parse(path.basename(url));
  const newFilename = parsedFilenane.name + '_' + hash + parsedFilenane.ext;
  return newFilename;
}
