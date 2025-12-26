import {Article} from '../data/types';

export function formatArticleHeading(article: Article): string {
  return `${article.number}. ${article.title}`;
}

export function findArticleById(catalogArticles: Article[], id: string): Article | undefined {
  return catalogArticles.find(article => article.id === id);
}
