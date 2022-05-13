import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { NotionModule } from './notion.js';
import { transformMd } from './transformMd.js';

dotenv.config();

async function run() {
    const notionModule = new NotionModule({
        api_key: process.env.NOTION_API_KEY,
        database_id: process.env.NOTION_DATABASE
    });

    const pages = await notionModule.fetchArticles();
    for (const page of pages) {

        const article = await notionModule.getArticle(page);

        const folderName = article.title.replace(/[^A-z0-9_]/g, '-').toLowerCase();
        const dirPath = path.join('posts/', folderName);
        const filePath = path.join(dirPath, '/index.md');
        fs.mkdirSync(dirPath, { recursive: true });
        
        // transform markdown
        article.markdown = await transformMd(article.content, article, dirPath);

        // save to disk
        fs.writeFileSync(filePath, article.markdown, 'utf8');
        
        console.log(`Saved ${article.id} to ${filePath}`);
    }

}
run();