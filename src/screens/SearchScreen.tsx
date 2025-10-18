import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import SearchInput from '../components/SearchInput';
import SearchResultCard from '../components/SearchResultCard';
import {useAppContext} from '../context/AppContext';
import {useSearch} from '../hooks/useSearch';
import Header from '../components/Header';
import {useThemeColors} from '../theme/colors';

interface Props {
  initialQuery?: string;
  initialCodeId?: string;
  onOpenArticle(articleId: string): void;
  onClose(): void;
}

const SearchScreen: React.FC<Props> = ({initialQuery = '', initialCodeId, onOpenArticle, onClose}) => {
  const {
    state: {catalog, fontScale},
  } = useAppContext();
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCode, setSelectedCode] = useState<string | undefined>(initialCodeId);
  const results = useSearch(query, {codeId: selectedCode});

  useEffect(() => {
    setQuery(initialQuery);
    setSelectedCode(initialCodeId);
  }, [initialCodeId, initialQuery]);

  const codes = useMemo(() => catalog?.codes ?? [], [catalog]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Поиск" onBack={onClose} />
      <View style={styles.inputWrapper}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Введите номер или текст статьи"
          onSubmit={() => undefined}
          onClear={() => setQuery('')}
        />
      </View>
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Кодекс:</Text>
        <FlatList
          data={[{title: 'Все кодексы', id: undefined as string | undefined}, ...codes.map(code => ({
            id: code.metadata.id,
            title: code.metadata.abbreviation,
          }))]}
          horizontal
          keyExtractor={item => item.id ?? 'all'}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            const active = item.id === selectedCode;
            return (
              <Text
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedCode(item.id)}
                accessibilityRole="button">
                {item.title}
              </Text>
            );
          }}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={item => item.articleId}
        contentContainerStyle={styles.results}
        ListEmptyComponent={
          <Text style={styles.placeholder}>
            {query ? 'Ничего не найдено' : 'Введите запрос для поиска'}
          </Text>
        }
        renderItem={({item}) => (
          <SearchResultCard item={item} query={query} onPress={() => onOpenArticle(item.articleId)} />
        )}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inputWrapper: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    filters: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    filterLabel: {
      fontSize: 14 * fontScale,
      color: colors.secondaryText,
      marginBottom: 8,
    },
    filterChip: {
      marginRight: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 14 * fontScale,
    },
    filterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: '#ffffff',
    },
    results: {
      padding: 16,
      paddingBottom: 32,
    },
    placeholder: {
      padding: 16,
      color: colors.secondaryText,
      fontSize: 14 * fontScale,
    },
  });

export default SearchScreen;
