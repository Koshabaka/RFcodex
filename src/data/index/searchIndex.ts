import {buildQueryTokens, stripWeight, tokenizeWithFieldBoost} from './tokenizer';
import {Catalog, InvertedIndex, Posting, SearchFilter, SearchResultItem} from '../types';

interface BuildOptions {
  catalog: Catalog;
  locale: string;
}

export function buildInvertedIndex({catalog, locale}: BuildOptions): InvertedIndex {
  const tokens: Record<string, Posting[]> = {};
  const documents: InvertedIndex['documents'] = {};
  catalog.codes.forEach(code => {
    code.chapters.forEach(chapter => {
      chapter.articles.forEach(article => {
        const docId = article.id;
        documents[docId] = {
          id: docId,
          codeId: article.codeId,
          articleId: article.id,
          title: article.title,
          number: article.number,
          breadcrumbs: article.breadcrumbs,
          text: article.text,
        };
        const seen: Record<string, Posting> = {};
        const tokensWithWeight = tokenizeWithFieldBoost(
          article.title,
          article.breadcrumbs,
          article.number,
          article.text
        );
        tokensWithWeight.forEach(tokenWithWeight => {
          const {term, weight} = stripWeight(tokenWithWeight.term);
          const posting = seen[term] || {docId, weight: 0, positions: []};
          posting.positions.push(tokenWithWeight.position);
          posting.weight += weight;
          seen[term] = posting;
        });
        Object.keys(seen).forEach(term => {
          if (!tokens[term]) {
            tokens[term] = [];
          }
          tokens[term].push(seen[term]);
        });
      });
    });
  });

  Object.keys(tokens).forEach(term => {
    tokens[term] = tokens[term]
      .sort((a, b) => b.weight - a.weight)
      .map(posting => ({
        docId: posting.docId,
        weight: parseFloat(posting.weight.toFixed(3)),
        positions: posting.positions,
      }));
  });

  return {
    version: 1,
    locale,
    tokenizer: 'rf-simple-tokenizer@1',
    documents,
    tokens,
    metadata: {
      builtAt: new Date().toISOString(),
    },
  };
}

export interface SearchOptions {
  query: string;
  filter?: SearchFilter;
  limit?: number;
}

export class SearchEngine {
  constructor(private index: InvertedIndex) {}

  search({query, filter, limit = 30}: SearchOptions): SearchResultItem[] {
    const tokens = buildQueryTokens(query);
    if (!tokens.length) {
      return [];
    }
    const scores = new Map<string, {score: number; positions: number[]}>();

    tokens.forEach(token => {
      const postings = this.getPostings(token);
      postings.forEach(posting => {
        const doc = this.index.documents[posting.docId];
        if (!doc) {
          return;
        }
        if (filter?.codeId && filter.codeId !== doc.codeId) {
          return;
        }
        const existing = scores.get(posting.docId) || {score: 0, positions: []};
        existing.score += posting.weight;
        existing.positions.push(...posting.positions);
        scores.set(posting.docId, existing);
      });
    });

    const results = Array.from(scores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit)
      .map(([docId, {score, positions}]) => {
        const doc = this.index.documents[docId];
        return {
          articleId: doc.articleId,
          codeId: doc.codeId,
          title: doc.title,
          number: doc.number,
          breadcrumbs: doc.breadcrumbs,
          snippet: this.createSnippet(doc.text, positions),
          score,
        };
      });

    return results;
  }

  private createSnippet(text: string, positions: number[]): string {
    if (!text) {
      return '';
    }
    const words = text.split(/\s+/);
    if (!positions.length) {
      return words.slice(0, 40).join(' ') + '…';
    }
    const pos = Math.min(...positions);
    const start = Math.max(0, pos - 5);
    const end = Math.min(words.length, pos + 20);
    return words.slice(start, end).join(' ') + '…';
  }

  private getPostings(token: string): Posting[] {
    const direct = this.index.tokens[token];
    if (direct) {
      return direct;
    }
    const exactPrefix = `${token}*`;
    const prefixMatches = this.index.tokens[exactPrefix] || [];
    if (prefixMatches.length) {
      return prefixMatches;
    }
    const fallbackMatches = Object.keys(this.index.tokens)
      .filter(key => key.startsWith(token))
      .flatMap(key => this.index.tokens[key]);
    return fallbackMatches;
  }
}

