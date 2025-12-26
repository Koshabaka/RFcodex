import catalog from '../data/dist/catalog.json';
import index from '../data/dist/index.json';
import {buildInvertedIndex, SearchEngine} from '../src/data/index/searchIndex';
import {Catalog} from '../src/data/types';

describe('search index', () => {
  const typedCatalog = catalog as Catalog;

  it('builds deterministic inverted index from catalog', () => {
    const built = buildInvertedIndex({catalog: typedCatalog, locale: 'ru-RU'});
    expect(Object.keys(built.documents)).toEqual(Object.keys(index.documents));
    expect(Object.keys(built.tokens).length).toBeGreaterThan(10);
  });

  it('finds articles by query and filters by code', () => {
    const engine = new SearchEngine(index);
    const results = engine.search({query: 'равенства участников'});
    expect(results[0].articleId).toBe('gk-part1-1');

    const filtered = engine.search({query: 'преступления', filter: {codeId: 'uk'}});
    expect(filtered[0].articleId).toBe('uk-general-14');
  });
});
