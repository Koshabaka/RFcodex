import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Code} from '../data/types';
import {useThemeColors} from '../theme/colors';
import {useAppContext} from '../context/AppContext';

interface Props {
  code: Code;
  onPress(): void;
}

const CodeCard: React.FC<Props> = ({code, onPress}) => {
  const colors = useThemeColors();
  const {
    state: {fontScale},
  } = useAppContext();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Открыть ${code.metadata.title}`}
      style={({pressed}) => [styles.container, pressed && styles.pressed]}
      android_ripple={{color: colors.border}}>
      <View>
        <Text style={styles.title}>{code.metadata.title}</Text>
        <Text style={styles.subtitle}>{code.metadata.abbreviation}</Text>
        <Text style={styles.meta}>Версия: {code.metadata.version}</Text>
        <Text style={styles.meta}>Обновлено: {code.metadata.updatedAt}</Text>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    pressed: {
      opacity: 0.7,
    },
    title: {
      fontSize: 18 * fontScale,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16 * fontScale,
      color: colors.secondaryText,
      marginBottom: 8,
    },
    meta: {
      fontSize: 12 * fontScale,
      color: colors.secondaryText,
    },
  });

export default CodeCard;
