import React, {useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import Header from '../components/Header';
import {useAppContext} from '../context/AppContext';
import {findArticle, findCodeById} from '../utils/catalog';
import {useThemeColors} from '../theme/colors';

interface Props {
  articleId: string;
  onClose(): void;
  onNavigate(articleId: string): void;
}

const ArticleScreen: React.FC<Props> = ({articleId, onClose, onNavigate}) => {
  const {
    state: {catalog, fontScale},
  } = useAppContext();
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);
  const [jumpArticle, setJumpArticle] = useState('');

  const article = useMemo(() => findArticle(catalog, articleId), [catalog, articleId]);
  const code = useMemo(() => (article ? findCodeById(catalog, article.codeId) : undefined), [catalog, article]);

  if (!article || !code) {
    return (
      <View style={styles.container}>
        <Header title="Статья" onBack={onClose} />
        <Text style={styles.placeholder}>Статья не найдена</Text>
      </View>
    );
  }

  const handleJump = () => {
    if (!jumpArticle.trim()) {
      return;
    }
    const targetNumber = jumpArticle.trim();
    const target = code.chapters.flatMap(chapter => chapter.articles).find(a => a.number === targetNumber);
    if (target) {
      onNavigate(target.id);
    } else {
      Alert.alert('Не найдено', `Статья ${targetNumber} не найдена в ${code.metadata.abbreviation}.`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={code.metadata.abbreviation} onBack={onClose} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.breadcrumbs}>{article.breadcrumbs.join(' / ')}</Text>
        <Text style={styles.title}>{article.number}. {article.title}</Text>
        <Text style={styles.body}>{article.text}</Text>
        <View style={styles.jumpContainer}>
          <Text style={styles.jumpLabel}>Быстрый переход к статье:</Text>
          <TextInput
            style={styles.jumpInput}
            value={jumpArticle}
            onChangeText={setJumpArticle}
            placeholder="Номер статьи"
            placeholderTextColor={colors.secondaryText}
            keyboardType="number-pad"
            accessibilityLabel="Номер статьи для перехода"
          />
          <Text style={styles.jumpButton} onPress={handleJump} accessibilityRole="button">
            Перейти
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    breadcrumbs: {
      fontSize: 12 * fontScale,
      color: colors.secondaryText,
      marginBottom: 8,
    },
    title: {
      fontSize: 20 * fontScale,
      fontWeight: '700',
      marginBottom: 16,
      color: colors.text,
    },
    body: {
      fontSize: 16 * fontScale,
      lineHeight: 24 * fontScale,
      color: colors.text,
    },
    jumpContainer: {
      marginTop: 32,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    jumpLabel: {
      fontSize: 14 * fontScale,
      marginBottom: 8,
      color: colors.text,
    },
    jumpInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16 * fontScale,
      color: colors.text,
      marginBottom: 12,
    },
    jumpButton: {
      fontSize: 16 * fontScale,
      color: colors.accent,
      fontWeight: '600',
    },
    placeholder: {
      padding: 16,
      fontSize: 16 * fontScale,
      color: colors.secondaryText,
    },
  });

export default ArticleScreen;
