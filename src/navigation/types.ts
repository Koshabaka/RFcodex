export type RouteName =
  | 'Home'
  | 'Search'
  | 'Article'
  | 'Updates'
  | 'Settings';

export type RouteParams =
  | {name: 'Home'}
  | {name: 'Search'; params?: {initialQuery?: string; codeId?: string}}
  | {name: 'Article'; params: {articleId: string}}
  | {name: 'Updates'}
  | {name: 'Settings'};

export interface Route extends RouteParams {
  key: string;
}
