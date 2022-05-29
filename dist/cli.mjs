#!/usr/bin/env node

/*!
 * NotionJAM v0.0.13 (https://github.com/victornpb/notion-jam)
 * Copyright (c) victornpb
 * @license UNLICENSED
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import defaults from 'default-args';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-2-markdown/build/notion-to-md.js';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import jsYaml from 'js-yaml';
import http from 'http';
import https from 'https';
import { visit } from 'unist-util-visit';
import crypto from 'crypto';

/*!
 * Unit tests
 * @see https://jsfiddle.net/Victornpb/80sgj5rx/
 */


function toCamelCase(str) {
  return tokenize(str).map((piece, i) => i > 0 ? piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase() : piece.toLowerCase()).join('');
}

function toPascalCase(str) {
  return tokenize(str).map(piece => piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()).join('');
}

function toKebabCase(str) {
  return tokenize(str).join('-').toLowerCase();
}

function toSnakeCase(str) {
  return tokenize(str).join('_').toLowerCase();
}

function tokenize(str) {
  return str.trim().match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
}

const caseTransforms = {
  camel: toCamelCase,
  pascal: toPascalCase,
  kebab: toKebabCase,
  snake: toSnakeCase,
  none: str => str,
};

function convertPropsCase(obj, caseType) {
  const toCase = caseTransforms[caseType];
  if (!toCase) throw new Error(`Unknown case type: ${caseType}! Valid values are: ${Object.keys(caseTransforms)}`);

  const newObj = {};
  for (const prop of Object.keys(obj)) {
    newObj[toCase(prop)] = obj[prop];
  }
  return newObj;
}

class NotionModule {

  constructor({ secret, database }, options) {

    this.options = defaults({
      filterProp: 'Status',
      filterValues: 'Ready,Published',
      caseType: 'snake',
    }, options);

    this.options.filterValues = Array.isArray(this.options.filterValues) ? this.options.filterValues : this.options.filterValues.split(',').map(value => value.trim());

    const databaseId = getDatabaseId(database);

    this.database_id = databaseId;
    this.notion = new Client({ auth: secret });
    this.notion2md = new NotionToMarkdown({ notionClient: this.notion });
  }

  async fetchArticles() {
    const pages = await this._fetchPagesFromDb(this.database_id);
    return pages;
  }

  async getArticle(page) {
    let article = {
      id: page.id,
      title: getTitle(page),
      ...toPlainPage(page),
      ...toPlainProperties(page.properties),
      content: await this._getPageMarkdown(page.id),
    };

    if (this.options.caseType) {
      article = convertPropsCase(article, this.options.caseType);
    }

    return article;
  }

  async _fetchPagesFromDb(database_id) {
    const response = await this.notion.databases.query({
      database_id: database_id,
      filter: {
        or: [
          ...this.options.filterValues.map(value => ({
            property: this.options.filterProp, select: { equals: value }
          })),
        ]
      }
    });
    // TODO: paginate more than 100 pages
    return response.results;
  }

  async _getPageMarkdown(page_id) {
    const mdBlocks = await this.notion2md.pageToMarkdown(page_id);
    return this.notion2md.toMarkdownString(mdBlocks);
  }

  async updateBlogStatus(page_id) {
    this.notion.pages.update({
      page_id: page_id,
      properties: {
        status: {
          select: {
            name: 'Published'
          }
        }
      }
    });
  }
}

function toPlainPage(page) {
  return {
    created_time: new Date(page.created_time),
    last_edited_time: new Date(page.last_edited_time),

    cover_image: page.cover?.external?.url || page.cover?.file.url,

    icon_image: page.icon?.file?.url,
    icon_emoji: page.icon?.emoji,
  };
}

function getTitle(page) {
  const titleProp = Object.values(page.properties).find(prop => prop.id === 'title');
  return titleProp.title[0]?.plain_text;
}

function toPlainProperties(properties) {
  const types = {
    title(prop) {
      return prop.title[0]?.plain_text;
    },
    rich_text(prop) {
      return prop.rich_text[0]?.plain_text;
    },
    number(prop) {
      return prop.number;
    },
    select(prop) {
      return prop.select?.name;
    },
    multi_select(prop) {
      return prop.multi_select.map(s => s.name);
    },
    date(prop) {
      return prop.date?.start ? new Date(prop.date?.start) : null;
    },
    files(prop) {
      const urls = prop.files?.map(file => file.file?.url || file.external?.url);
      return urls.length <= 1 ? urls[0] : urls;
    },
    checkbox(prop) {
      return prop.checkbox;
    },
    url(prop) {
      return prop.url;
    },
    email(prop) {
      return prop.email;
    },
    phone_number(prop) {
      return prop.phone_number;
    },
    created_time(prop) {
      return new Date(prop.created_time);
    },
    last_edited_time(prop) {
      return new Date(prop.last_edited_time);
    },
  };
  const obj = {};
  for (const [key, value] of Object.entries(properties)) {
    if (types[value.type]) {
      obj[key] = types[value.type](value);
    }
    else {
      console.warn(`Unknown block type: ${value.type}`);
      obj[key] = value[value.type];
    }
  }
  return obj;
}

function getDatabaseId(string) {
  const isValidId = str => /^[0-9a-f]{32}$/.test(str);
  if (isValidId(string)) return string;
  try {
    const parsedUrl = new URL(string);
    const id = parsedUrl.pathname.match(/\b([0-9a-f]{32})\b/)[1];
    if (isValidId(id)) return id;
    else throw new Error('URL does not contain a valid database id');
  }
  catch (error) {
    throw new Error('Database is not valid databaseID or Notion URL! ' + error);
  }
}

function plugin$2(frontmatter) {
  return function transform(tree, vFile) {
    tree.children.unshift({
      type: 'yaml',
      value: jsYaml.dump(frontmatter)
    });
  };
}

function parallel(items, handler, concurrency) {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error('concurrency must be a positive integer greater than 0');
  if (items.length === 0) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const results = [];
    let i = 0;

    const next = (result) => {
      results.push(result);
      if (i < items.length) {
        try {
          handler(items[i++]).then(next).catch(reject);
        } catch (err) { reject(err); }
      }
      else if (results.length === items.length) resolve(results);
    };

    for (let x = 0; x < Math.min(concurrency, items.length); x++) {
      try {
        handler(items[i++]).then(next).catch(reject);
      } catch (err) { reject(err); break; }
    }
  });
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

function isUrl(url) {
  return /^https?:\/\//.test(url);
}

function urlWithoutQuery(url) {
  const parsedURI = new URL(url);
  return new URL(parsedURI.pathname, parsedURI.href).href;
}

function isImage(headers) {
  return headers['content-type'].startsWith('image/');
}

function getSize(headers = {}) {
  return parseInt(headers['content-length'] || headers['Content-Length']) || 0;
}

function plugin$1(options) {

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

function plugin(frontmatter) {
  return function transform(tree, vFile) {

    let frontmatterNode;
    visit(tree, 'yaml', async node => {
      frontmatterNode = node;
    });

    if (frontmatterNode) {

      const bodyImages = [];
      visit(tree, 'image', async node => {
        bodyImages.push(node.url);
      });

      const frontmatter = jsYaml.load(frontmatterNode.value);
      if (frontmatter.thumb === 'cover') frontmatter._thumbnail = frontmatter.cover_image;
      else if (frontmatter.thumb === 'icon') frontmatter._thumbnail = frontmatter.icon_image;
      else if (frontmatter.thumb === 'first') frontmatter._thumbnail = bodyImages[0];
      else if (/^\d+$/.test(frontmatter.thumb)) frontmatter._thumbnail = bodyImages[parseInt(frontmatter.thumb)+1];
      else frontmatter._thumbnail = frontmatter[frontmatter.thumb] || frontmatter.cover_image || bodyImages[0] || frontmatter.icon_image;

      // update frontmatter
      frontmatterNode.value = jsYaml.dump(frontmatter);
    }
    else throw new Error('No frontmatter found');
  };
}

async function transformMd({ markdown, article, articlePath, assetsPath }, options) {

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
    .use(plugin$2, frontmatter)
    .use(plugin$1, {
      outDir: assetsPath, // where to save images
      markdownPath: articlePath, // used to resolve relative image paths
      concurrency: options.parallelDownloadsPerPage, // number of concurrent downloads
      skipDownloaded: options.skipDownloadedImages, // skip downloading files already exist
      downloadFrontmatterImages: options.downloadFrontmatterImages, // download images in frontmatter
      timeout: options.downloadImageTimeout, // timeout in milliseconds
      maxFileSize: Infinity, // max file size in bytes
    })
    .use(plugin)
    .use(remarkStringify)
    .process(markdown);

  return vFile.toString(); // the new markdown string
}

function safeName(name) {
  return String(name).replace(/[^A-z0-9_]/g, '-').substring(0, 64);
}

/**
 * Replace all {key} placeholders in a string with the corresponding value from an object array or list of argumments.
 * @param {string} str The string template.
 * @param {object|array} args The object containing the values to replace the tokens with.
 * @param {function} [replacer] A function that can be used to modify the value before it is used.
 * @returns {string} The new string with the tokens replaced.
 * @author victornpb https://gist.github.com/victornpb/5a9642b1d5f749695e14
 *
 * @example
 * format("hello {0} world {1}!", "foo", "bar"); //"hello foo world bar"
 * format("hello {0} world {1}!", ["foo", "bar"]); //"hello foo world bar"
 * format("hello {name} world {test}!", {name: "foo", test: "bar"}); //"hello foo world bar"
 * format("hello {obj.name} world {obj.test[0]}!", {obj:{name: "foo", test: ["bar"]}}); //"hello foo world bar"
 */
function format(string, args, replacer) {
  const useReplacer = typeof replacer === 'function';
  return String(string).replace(/\{([^}]+)\}/g, (m, key) => {
    let val = getDeepVal(args, key, useReplacer ? null : m);
    if (useReplacer) val = replacer(val, key, m, args);
    return val;
  });
}


/**
 * Access a deep value inside an object
 * Works by passing a path like "foo.bar", also works with nested arrays like "foo[0][1].baz"
 * @author Victor B. https://gist.github.com/victornpb/4c7882c1b9d36292308e
 * Unit tests: http://jsfiddle.net/Victornpb/0u1qygrh/
 * @param {any} object Any object
 * @param {string} path Property path to access e.g.: "foo.bar[0].baz.1.a.b"
 * @param {any} [defaultValue=undefined] Optional value to return when property doesn't exist or is undefined
 * @return {any}
 */
function getDeepVal(object, path, defaultValue = undefined) {
  if (typeof object === 'undefined' || object === null) return defaultValue;
  const pathArray = path.split(/\.|\[["']?|["']?\]/);
  for (let i = 0, l = pathArray.length; i < l; i++) {
    if (pathArray[i] === '') continue;
    object = object[pathArray[i]];
    if (typeof object === 'undefined' || object === null) return defaultValue;
  }
  return (typeof object === 'undefined' || object === null) ? defaultValue : object;
}

function toBool(value) {
  return value === 'true' || value === true;
}

function toInt(value) {
  return parseInt(value, 10);
}

async function run(options) {
  console.time('run');

  options = defaults({
    notionSecret: undefined,
    notionDatabase: undefined,

    filterProp: 'Status',
    filterValues: 'Ready,Published',
    caseType: 'snake',

    parallelPages: 25,
    parallelDownloadsPerPage: 3,
    downloadImageTimeout: 30,
    skipDownloadedImages: true,
    articlePath: 'posts/{title}/index.md',
    assetsPath: '.', // relative to the markdown file if starts with '.', or absolute otherwise
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

dotenv.config();

async function main() {
  try {
    await run({
      notionSecret: process.env.NOTION_SECRET,
      notionDatabase: process.env.NOTION_DATABASE,
      filterProp: process.env.FILTER_PROP,
      filterValues: process.env.FILTER_VALUES,
      caseType: process.env.CONVERT_PROP_CASE,
      articlePath: process.env.ARTICLE_PATH,
      assetsPath: process.env.ASSETS_PATH,
      parallelPages: process.env.PARALLEL_PAGES,
      parallelDownloadsPerPage: process.env.PARALLEL_DOWNLOADS_PER_PAGE,
      downloadImageTimeout: process.env.DOWNLOAD_IMAGE_TIMEOUT,
      skipDownloadedImages: process.env.SKIP_DOWNLOADED_IMAGES,
      downloadFrontmatterImages: process.env.DOWNLOAD_FRONTMATTER_IMAGES,
    });
  } catch (error) {
    console.error(error);
  }
}
main();
