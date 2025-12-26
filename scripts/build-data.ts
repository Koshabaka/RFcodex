import fs from 'fs';
import path from 'path';
import {Catalog, Code, CodeMetadata} from '../src/data/types';
import {buildInvertedIndex} from '../src/data/index/searchIndex';

interface RawArticle {
  number: string;
  title: string;
  text: string;
  breadcrumbs: string[];
}

interface RawChapter {
  id: string;
  title: string;
  number: string;
  articles: RawArticle[];
}

interface RawCode {
  metadata: CodeMetadata;
  chapters: RawChapter[];
}

const rawDir = path.resolve(__dirname, '..', 'data', 'raw');
const distDir = path.resolve(__dirname, '..', 'data', 'dist');

function readRawCodes(): Code[] {
  const files = fs.readdirSync(rawDir).filter(file => file.endsWith('.json'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(rawDir, file), 'utf8');
    const raw = JSON.parse(content) as RawCode;
    const code: Code = {
      metadata: raw.metadata,
      chapters: raw.chapters.map(chapter => ({
        id: chapter.id,
        codeId: raw.metadata.id,
        title: chapter.title,
        number: chapter.number,
        articles: chapter.articles.map(article => ({
          id: `${raw.metadata.id}-${chapter.id}-${article.number}`,
          codeId: raw.metadata.id,
          chapterId: chapter.id,
          title: article.title,
          number: article.number,
          text: article.text,
          breadcrumbs: article.breadcrumbs,
        })),
      })),
    };
    return code;
  });
}

function ensureDistDir() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, {recursive: true});
  }
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(path.join(distDir, file), JSON.stringify(data, null, 2), 'utf8');
}

async function build() {
  ensureDistDir();
  const codes = readRawCodes();
  const catalog: Catalog = {codes};
  writeJson('catalog.json', catalog);
  const index = buildInvertedIndex({catalog, locale: 'ru-RU'});
  writeJson('index.json', index);
  writeJson('index.meta.json', {
    documents: Object.keys(index.documents).length,
    tokens: Object.keys(index.tokens).length,
    builtAt: index.metadata.builtAt,
  });
  console.log(`Каталог из ${codes.length} кодексов собран.`);
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
