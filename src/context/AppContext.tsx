import React, {createContext, useContext, useEffect, useMemo, useReducer} from 'react';
import {Appearance} from 'react-native';
import dataService from '../data/dataService';
import {Catalog, InvertedIndex} from '../data/types';
import {SearchEngine} from '../data/index/searchIndex';

type ThemePreference = 'system' | 'light' | 'dark';

type State = {
  catalog?: Catalog;
  index?: InvertedIndex;
  searchEngine?: SearchEngine;
  loading: boolean;
  error?: string;
  theme: ThemePreference;
  fontScale: number;
};

type Action =
  | {type: 'loaded'; payload: {catalog: Catalog; index: InvertedIndex}}
  | {type: 'error'; payload: string}
  | {type: 'setTheme'; payload: ThemePreference}
  | {type: 'setFontScale'; payload: number};

const initialState: State = {
  loading: true,
  theme: 'system',
  fontScale: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded': {
      const engine = new SearchEngine(action.payload.index);
      return {
        ...state,
        loading: false,
        catalog: action.payload.catalog,
        index: action.payload.index,
        searchEngine: engine,
        error: undefined,
      };
    }
    case 'error':
      return {...state, loading: false, error: action.payload};
    case 'setTheme':
      return {...state, theme: action.payload};
    case 'setFontScale':
      return {...state, fontScale: action.payload};
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  setTheme(theme: ThemePreference): void;
  setFontScale(value: number): void;
} | null>(null);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [catalog, index] = await Promise.all([
          dataService.getCatalog(),
          dataService.getIndex(),
        ]);
        if (mounted) {
          dispatch({type: 'loaded', payload: {catalog, index}});
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          dispatch({type: 'error', payload: (error as Error).message});
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      state,
      setTheme: (theme: ThemePreference) => dispatch({type: 'setTheme', payload: theme}),
      setFontScale: (fontScale: number) => dispatch({type: 'setFontScale', payload: fontScale}),
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('AppContext not found');
  }
  return ctx;
}

export function useResolvedTheme(): 'light' | 'dark' {
  const {
    state: {theme},
  } = useAppContext();
  if (theme === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return theme;
}
