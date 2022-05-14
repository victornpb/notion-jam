import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { visit } from 'unist-util-visit';
import defaults from 'default-args';
import parallel from './utils/parallel.js';

export default function plugin(options) {

    options = defaults({
        concurrency: 1,
        outDir: './',

        maxFileSize: Infinity,
        skipDownloaded: false,
        timeout: 1000 * 30,
    }, options);

    return async function transform(tree, vfile) {

        const imageNodes = [];

        // find images with remote urls
        visit(tree, 'image', async node => {
            const { url, position } = node;
            if (!url.startsWith('http://') && !url.startsWith('https://')) return;

            let parsedURI;
            try {
                parsedURI = new URL(url);
            } catch (error) {
                return vfile.message(`Invalid URL: ${url}`, position, url);
            }
            imageNodes.push(node);
        });

        if (imageNodes.length > 0) {
            await fs.promises.mkdir(options.outDir, { recursive: true });
        }

        await parallel(imageNodes, async (node) => {
            const { url, position } = node;

            const parsedURI = new URL(url);
            const urlWithoutQuery = new URL(parsedURI.pathname, parsedURI.href).href;

            const imageFilename = hashFilename(urlWithoutQuery);
            const destination = path.join(options.outDir, imageFilename);
            const src = './' + imageFilename;

            let result;
            if (options.skipDownloaded && fs.existsSync(destination)) {
                // skip downloading file already exists
                console.log(`Skipping ${url}`);
                result = true;
            }
            else {
                // download image
                try {
                    result = await downloadImage(url, destination, {
                        maxSize: options.maxSize,
                        timeout: options.timeout,
                    });
                    console.log(`Downloaded ${url}`);
                }
                catch (error) {
                    console.error(`Failed to download ${url}: ${error.message}`);
                    vfile.message(error.message, position, url);
                }
            }
            
            if (result) {
                // rewrite ![image](url) with the local path
                node.url = src;
            }
        }, options.concurrency);

    }
}


function downloadImage(url, targetPath, { timeout = 1000 * 30, maxSize = Infinity }) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const httpRequest = parsedUrl.protocol === 'https:' ? https : http;

        const req = httpRequest.get(url, { timeout: timeout }, res => {
            const headers = res.headers;
            const statusCode = res.statusCode;

            let error;

            const fileSize = getSize(headers);
            if (statusCode === 200 && isImage(headers) && fileSize <= maxSize) {
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
                    error = new Error(`Content-Type of ${url} is not an image/ type`)
                } else if (fileSize > maxFileSize) {
                    error = new Error(`File at ${url} weighs ${headers['content-length']}, max size is ${maxFileSize}`)
                }

                req.destroy()
                res.resume()
                reject(error)
                return;
            }
        })

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

function hashFilename(url) {
    const hash = crypto.createHash('sha1').update(url).digest('base64').replace(/[+/=]/g, '').substring(0, 8);
    const parsedFilenane = path.parse(path.basename(url))
    const newFilename = parsedFilenane.name + '-' + hash + parsedFilenane.ext;
    return newFilename;
}
