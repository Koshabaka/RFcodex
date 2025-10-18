export interface Article {
  id: string;
  codeId: string;
  chapterId: string;
  title: string;
  number: string;
  text: string;
  breadcrumbs: string[];
}

export interface Chapter {
  id: string;
  codeId: string;
  parentId?: string;
  title: string;
  number: string;
  articles: Article[];
}

export interface CodeMetadata {
  id: string;
  title: string;
  abbreviation: string;
  updatedAt: string;
  version: string;
}

export interface Code {
  metadata: CodeMetadata;
  chapters: Chapter[];
}

export interface Catalog {
  codes: Code[];
}

export interface TokenDocument {
  id: string;
  codeId: string;
  articleId: string;
  token: string;
  positions: number[];
  weight: number;
}

export interface Posting {
  docId: string;
  weight: number;
  positions: number[];
}

export interface InvertedIndex {
  version: number;
  locale: string;
  tokenizer: string;
  documents: Record<
    string,
    {
      id: string;
      codeId: string;
      articleId: string;
      title: string;
      number: string;
      breadcrumbs: string[];
      text: string;
    }
  >;
  tokens: Record<string, Posting[]>;
  metadata: {
    builtAt: string;
  };
}

export interface SearchFilter {
  codeId?: string;
}

export interface SearchResultItem {
  articleId: string;
  codeId: string;
  title: string;
  number: string;
  snippet: string;
  breadcrumbs: string[];
  score: number;
}

export interface DataSource {
  loadCatalog(): Promise<Catalog>;
  loadIndex(): Promise<InvertedIndex>;
}
