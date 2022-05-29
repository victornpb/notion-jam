
import defaults from 'default-args';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-2-markdown/build/notion-to-md.js';
import { convertPropsCase } from '../utils/transformVariables.js';

export class NotionModule {

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
