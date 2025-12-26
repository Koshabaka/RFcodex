import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SearchResultItem} from '../data/types';
import {highlightSnippet} from '../utils/highlight';
import {useThemeColors} from '../theme/colors';
import {useAppContext} from '../context/AppContext';

interface Props {
  item: SearchResultItem;
  query: string;
  onPress(): void;
}

const SearchResultCard: React.FC<Props> = ({item, query, onPress}) => {
  const colors = useThemeColors();
  const {
    state: {fontScale},
  } = useAppContext();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);
  const highlighted = highlightSnippet(item.snippet, query);

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Открыть статью ${item.number}`}
      android_ripple={{color: colors.border}}>
      <Text style={styles.breadcrumbs} numberOfLines={2}>
        {item.breadcrumbs.join(' / ')}
      </Text>
      <Text style={styles.title}>{item.number}. {item.title}</Text>
      <Text style={styles.snippet}>{highlighted}</Text>
    </Pressable>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    pressed: {
      opacity: 0.7,
    },
    breadcrumbs: {
      fontSize: 12 * fontScale,
      color: colors.secondaryText,
      marginBottom: 4,
    },
    title: {
      fontSize: 16 * fontScale,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    snippet: {
      fontSize: 14 * fontScale,
      color: colors.secondaryText,
    },
  });

export default SearchResultCard;
