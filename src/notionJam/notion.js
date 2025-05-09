
import defaults from 'default-args';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-2-markdown/build/notion-to-md.js';
import { convertPropsCase } from '../utils/transformVariables.js';

export class NotionModule {

  constructor({ secret, database }, options) {

    this.options = defaults({
      filterProp: 'Status',
      filterType: 'select',
      filterValues: 'Ready,Published',
      caseType: 'snake',
    }, options);

    this.options.should_ignore_filters = options.should_ignore_filters || false;

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

    const cachedRelations = {};

    const articleRelations = await Promise.allSettled(Object.entries(page.properties)
      .filter(([ key, value]) => typeof value === 'object' && value.type === 'relation')
      .map(async ( [key, {relation}] ) => {
        let relationData = relation;
        if(relation?.length > 0){
          relationData = await Promise.allSettled(relation.map(async(relationData) => {
            if(!cachedRelations?.[relationData.id]){
              const getRelationToGetDB = await this.getRelation(relationData.id);

              const filterProp = Object.values(getRelationToGetDB.properties).filter(({id}) => id === 'title')[0];

              cachedRelations[relationData.id] = filterProp.title[0].plain_text;
            }

            return cachedRelations[relationData.id];

          })).then((results) => results.map(({value}) => value));
        }

        return {[key]: relationData};
      }))
      .then((results) => Object.assign({}, ...results.map(({value}) => value)));

    article = { ...article, ...articleRelations };

    if (this.options.caseType) {
      article = convertPropsCase(article, this.options.caseType);
    }

    return article;
  }

  async getRelation(relation_id){
    const response = await this.notion.pages.retrieve({ page_id: relation_id });

    return response;
  }

  async _fetchPagesFromDb(database_id) {
    let filter;
    if(!this.options.should_ignore_filters){
      filter = {
        or: [
          ...this.options.filterValues.map(value => ({
            property: this.options.filterProp, [this.options.filterType]: { equals: value }
          })),
        ]
      };

    }

    const response = await this.notion.databases.query({
      database_id: database_id,
      filter: filter
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

  async getDatabase(database_id) {
    const response = await this.notion.databases.retrieve({ database_id: database_id });
    return response;
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
    relation(prop){
      return prop.relation;
    },
    formula(prop){
      return prop?.formula?.[prop.formula.type] ?? prop.formula;
    },
    status(prop){
      return prop.status?.name;
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
