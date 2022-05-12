
import { Client } from '@notionhq/client';
import Notion2md from 'notion-to-md';


export class NotionModule {

    constructor({ api_key, database_id }) {
        this.database_id = database_id;
        this.notion = new Client({ auth: api_key });
        this.notion2md = new Notion2md({ notionClient: this.notion });
    }

    async fetchArticles() {
        const articles = [];
        const pages = await this.fetchPagesFromDb(this.database_id);
        for (const page of pages) {
            const title = getTitle(page);
            if (title) {
                console.log(`Fetching page content (${page.id}) "${title}"...`);
                const article = {
                    id: page.id,
                    title: title,
                    ...toPlainPage(page),
                    ...toPlainProperties(page.properties),
                    markdown: await this.getPageMarkdown(page.id),
                };
                articles.push(article);
            }
            else console.log (`Skipping ${page.id}, bacause it has no title`);
        };
        return articles;
    }

    async fetchPagesFromDb(database_id) {
        const response = await this.notion.databases.query({
            database_id: database_id,
            filter: {
                or: [
                    { property: 'Status', select: { equals: 'Ready' } },
                    { property: 'Status', select: { equals: 'Published' } }
                ]
            }
        });
        // TODO: paginate
        return response.results;
    }

    async getPageMarkdown(page_id) {
        const mdBlocks = await this.notion2md.pageToMarkdown(page_id);
        return this.notion2md.toMarkdownString(mdBlocks);
    }

    async updateBlogStatus(page_id) {
        this.notion.pages.update({
            page_id: page_id,
            properties: {
                status: {
                    select: {
                        name: "Published"
                    }
                }
            }
        });
    }
}

function toPlainPage(page) {
    return {
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,

        cover_image: page.cover?.external?.url,
        icon: page.icon?.external?.url,

        //properties: toPlainProperties(page.properties),
    };
}

function getTitle(page) {
    const titleProp = Object.values(page.properties).find(prop => prop.id === 'title');
    return titleProp.title[0]?.plain_text;
}

function toPlainProperties(properties) {
    const types = {
        checkbox(prop) {
            return prop.checkbox;
        },
        multi_select(prop) {
            return prop.multi_select.map(s => s.name);
        },
        created_time(prop) {
            return new Date(prop.created_time);
        },
        last_edited_time(prop) {
            return new Date(prop.last_edited_time);
        },
        title(prop) {
            return prop.title[0]?.plain_text;
        },
        select(prop) {
            return prop.select.name;
        },
        rich_text(prop) {
            return prop.rich_text[0]?.plain_text;
        },
        date(prop) {
            return new Date(prop.date?.start);
        },
    };
    const obj = {};
    for (const [key, value] of Object.entries(properties)) {
        if (types[value.type]) {
            obj[key] = types[value.type](value);
        }
        else {
            console.log(`Unknown type: ${value.type}`);
            obj[key] = value;
        }
    }
    return obj;
}