import jsonDataSource, {JsonDataSource} from './storage/jsonDataSource';
import SqliteDataSource from './storage/sqliteDataSource';
import {Catalog, DataSource, InvertedIndex} from './types';

class DataService {
  private primary: DataSource;

  constructor() {
    const sqlite = new SqliteDataSource(jsonDataSource);
    this.primary = sqlite;
  }

  async getCatalog(): Promise<Catalog> {
    return this.primary.loadCatalog();
  }

  async getIndex(): Promise<InvertedIndex> {
    return this.primary.loadIndex();
  }

  getFallback(): JsonDataSource {
    return jsonDataSource;
  }
}

export default new DataService();
