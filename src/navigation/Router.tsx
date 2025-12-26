import React, {useMemo, useReducer} from 'react';
import {StyleSheet, View} from 'react-native';
import {Route, RouteParams} from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ArticleScreen from '../screens/ArticleScreen';
import UpdatesScreen from '../screens/UpdatesScreen';
import SettingsScreen from '../screens/SettingsScreen';

interface RouterState {
  stack: Route[];
}

type RouterAction =
  | {type: 'push'; route: RouteParams}
  | {type: 'replace'; route: RouteParams}
  | {type: 'pop'}
  | {type: 'reset'; routes: RouteParams[]};

const initialRoute: Route = {name: 'Home', key: 'home'};

function createRoute(route: RouteParams): Route {
  return {
    ...route,
    key: `${route.name}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  } as Route;
}

function routerReducer(state: RouterState, action: RouterAction): RouterState {
  switch (action.type) {
    case 'push':
      return {stack: [...state.stack, createRoute(action.route)]};
    case 'replace':
      return {
        stack: [...state.stack.slice(0, -1), createRoute(action.route)],
      };
    case 'pop':
      if (state.stack.length <= 1) {
        return state;
      }
      return {stack: state.stack.slice(0, -1)};
    case 'reset':
      return {stack: action.routes.map(createRoute)};
    default:
      return state;
  }
}

interface RouterContextValue {
  navigate(route: RouteParams): void;
  push(route: RouteParams): void;
  pop(): void;
  replace(route: RouteParams): void;
}

export const RouterContext = React.createContext<RouterContextValue | undefined>(undefined);

export const RouterProvider: React.FC<{children?: React.ReactNode}> = ({children = null}) => {
  const [state, dispatch] = useReducer(routerReducer, {stack: [initialRoute]});

  const contextValue = useMemo(
    () => ({
      navigate: (route: RouteParams) => dispatch({type: 'replace', route}),
      push: (route: RouteParams) => dispatch({type: 'push', route}),
      pop: () => dispatch({type: 'pop'}),
      replace: (route: RouteParams) => dispatch({type: 'replace', route}),
    }),
    []
  );

  const current = state.stack[state.stack.length - 1];

  return (
    <RouterContext.Provider value={contextValue}>
      <View style={styles.container}>{renderRoute(current, contextValue)}</View>
      {children}
    </RouterContext.Provider>
  );
};

function renderRoute(route: Route, router: RouterContextValue) {
  switch (route.name) {
    case 'Home':
      return (
        <HomeScreen
          onOpenSearch={codeId => router.push({name: 'Search', params: {codeId}})}
          onOpenUpdates={() => router.push({name: 'Updates'})}
          onOpenSettings={() => router.push({name: 'Settings'})}
        />
      );
    case 'Search':
      return (
        <SearchScreen
          initialQuery={route.params?.initialQuery}
          initialCodeId={route.params?.codeId}
          onOpenArticle={articleId => router.push({name: 'Article', params: {articleId}})}
          onClose={() => router.pop()}
        />
      );
    case 'Article':
      return (
        <ArticleScreen
          articleId={route.params.articleId}
          onClose={() => router.pop()}
          onNavigate={articleId => router.replace({name: 'Article', params: {articleId}})}
        />
      );
    case 'Updates':
      return <UpdatesScreen onClose={() => router.pop()} />;
    case 'Settings':
      return <SettingsScreen onClose={() => router.pop()} />;
    default:
      return null;
  }
}

export function useRouter() {
  const ctx = React.useContext(RouterContext);
  if (!ctx) {
    throw new Error('Router context is not available');
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
