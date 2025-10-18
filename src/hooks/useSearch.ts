import {useMemo} from 'react';
import {useAppContext} from '../context/AppContext';
import {SearchFilter, SearchResultItem} from '../data/types';

export function useSearch(query: string, filter?: SearchFilter): SearchResultItem[] {
  const {
    state: {searchEngine},
  } = useAppContext();

  return useMemo(() => {
    if (!searchEngine || !query) {
      return [];
    }
    return searchEngine.search({query, filter});
  }, [filter, query, searchEngine]);
}
