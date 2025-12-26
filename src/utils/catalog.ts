import {Article, Catalog, Code} from '../data/types';

export function flattenArticles(catalog?: Catalog): Article[] {
  if (!catalog) {
    return [];
  }
  const articles: Article[] = [];
  catalog.codes.forEach(code => {
    code.chapters.forEach(chapter => {
      chapter.articles.forEach(article => {
        articles.push(article);
      });
    });
  });
  return articles;
}

export function findArticle(catalog: Catalog | undefined, id: string): Article | undefined {
  if (!catalog) {
    return undefined;
  }
  for (const code of catalog.codes) {
    for (const chapter of code.chapters) {
      const found = chapter.articles.find(article => article.id === id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export function findCodeById(catalog: Catalog | undefined, id: string): Code | undefined {
  return catalog?.codes.find(code => code.metadata.id === id);
}
