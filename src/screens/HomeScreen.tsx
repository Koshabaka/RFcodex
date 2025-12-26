import React, {useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import CodeCard from '../components/CodeCard';
import SearchInput from '../components/SearchInput';
import {useAppContext} from '../context/AppContext';
import {useThemeColors} from '../theme/colors';

interface Props {
  onOpenSearch(codeId?: string): void;
  onOpenUpdates(): void;
  onOpenSettings(): void;
}

const HomeScreen: React.FC<Props> = ({onOpenSearch, onOpenUpdates, onOpenSettings}) => {
  const {
    state: {catalog, loading, fontScale},
  } = useAppContext();
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!catalog) {
      return [];
    }
    const normalized = filter.toLowerCase();
    return catalog.codes.filter(code =>
      code.metadata.title.toLowerCase().includes(normalized) ||
      code.metadata.abbreviation.toLowerCase().includes(normalized)
    );
  }, [catalog, filter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Кодексы РФ</Text>
        <View style={styles.actionsRow}>
          <Text onPress={onOpenUpdates} style={styles.link} accessibilityRole="button">
            Проверить обновления
          </Text>
          <Text onPress={onOpenSettings} style={styles.link} accessibilityRole="button">
            Настройки
          </Text>
        </View>
      </View>
      <View style={styles.searchWrapper}>
        <SearchInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Быстрый поиск по названию"
          onSubmit={() => onOpenSearch()}
          onClear={() => setFilter('')}
        />
        <Text style={styles.secondaryAction} onPress={() => onOpenSearch()} accessibilityRole="button">
          Расширенный поиск
        </Text>
      </View>
      {loading ? (
        <Text style={styles.placeholder}>Загрузка данных…</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.metadata.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <CodeCard code={item} onPress={() => onOpenSearch(item.metadata.id)} />
          )}
          ListEmptyComponent={<Text style={styles.placeholder}>Ничего не найдено</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    heading: {
      fontSize: 24 * fontScale,
      fontWeight: '700',
      marginBottom: 8,
      color: colors.text,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    link: {
      fontSize: 14 * fontScale,
      color: colors.accent,
    },
    searchWrapper: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    secondaryAction: {
      marginTop: 8,
      fontSize: 14 * fontScale,
      color: colors.accent,
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    placeholder: {
      padding: 16,
      fontSize: 14 * fontScale,
      color: colors.secondaryText,
    },
  });

export default HomeScreen;
