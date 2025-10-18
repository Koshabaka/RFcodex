import {NativeModules, Platform} from 'react-native';
import {Catalog, DataSource, InvertedIndex} from '../types';

type NativeModuleShape = {
  loadCatalog(): Promise<string>;
  loadIndex(): Promise<string>;
};

const moduleName = Platform.select({ios: 'RFCodesDatabase', android: 'RFCodesDatabase'});

const nativeModule: NativeModuleShape | undefined =
  moduleName && (NativeModules as any)[moduleName];

if (__DEV__ && !nativeModule) {
  console.warn(
    'RFCodesDatabase native module is not registered. Falling back to JSON data source. '
  );
}

async function parseCatalog(raw: string): Promise<Catalog> {
  return JSON.parse(raw);
}

async function parseIndex(raw: string): Promise<InvertedIndex> {
  return JSON.parse(raw);
}

export class SqliteDataSource implements DataSource {
  constructor(private fallback: DataSource) {}

  async loadCatalog(): Promise<Catalog> {
    if (!nativeModule) {
      return this.fallback.loadCatalog();
    }
    const raw = await nativeModule.loadCatalog();
    return parseCatalog(raw);
  }

  async loadIndex(): Promise<InvertedIndex> {
    if (!nativeModule) {
      return this.fallback.loadIndex();
    }
    const raw = await nativeModule.loadIndex();
    return parseIndex(raw);
  }
}

export default SqliteDataSource;
