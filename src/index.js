import { NotionModule } from './notion.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function run() {
    const notionModule = new NotionModule({
        api_key: process.env.NOTION_API_KEY,
        database_id: process.env.NOTION_DATABASE
    });

    const pages = await notionModule.fetchArticles();
    for (const page of pages) {
        const folderName = page.title.replace(/\s/g, '-').toLowerCase();
        // save to disk
        const filePath = path.join('posts/', folderName, '/index.md');
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, page.markdown, 'utf8');
        console.log(`Saved ${page.id} to ${filePath}`);
    }
    console.log(pages);

}
run();