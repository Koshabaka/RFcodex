import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useThemeColors} from '../theme/colors';
import {useAppContext} from '../context/AppContext';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({title, onBack, rightAction}) => {
  const colors = useThemeColors();
  const {
    state: {fontScale},
  } = useAppContext();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);

  return (
    <View style={styles.container} accessibilityRole="header">
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={onBack}
          style={styles.backButton}>
          <Text style={styles.backText}>Назад</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={styles.title} accessibilityRole="text">
        {title}
      </Text>
      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      padding: 8,
    },
    backText: {
      fontSize: 16 * fontScale,
      color: colors.accent,
    },
    backPlaceholder: {
      width: 64,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18 * fontScale,
      fontWeight: '600',
      color: colors.text,
    },
    rightContainer: {
      width: 64,
      alignItems: 'flex-end',
    },
  });

export default Header;
