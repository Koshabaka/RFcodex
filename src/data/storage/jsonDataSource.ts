import {Catalog, DataSource, InvertedIndex} from '../types';

const catalog: Catalog = require('../../../data/dist/catalog.json');
const index: InvertedIndex = require('../../../data/dist/index.json');

export class JsonDataSource implements DataSource {
  async loadCatalog(): Promise<Catalog> {
    return catalog;
  }

  async loadIndex(): Promise<InvertedIndex> {
    return index;
  }
}

export default new JsonDataSource();
