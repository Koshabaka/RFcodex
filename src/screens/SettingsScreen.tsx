import React from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';
import {useAppContext} from '../context/AppContext';
import {useThemeColors} from '../theme/colors';

interface Props {
  onClose(): void;
}

const themes: {label: string; value: 'system' | 'light' | 'dark'}[] = [
  {label: 'Системная', value: 'system'},
  {label: 'Светлая', value: 'light'},
  {label: 'Тёмная', value: 'dark'},
];

const fontScales = [0.9, 1, 1.2, 1.4];

const SettingsScreen: React.FC<Props> = ({onClose}) => {
  const {
    state: {theme, fontScale},
    setTheme,
    setFontScale,
  } = useAppContext();
  const colors = useThemeColors();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Настройки" onBack={onClose} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тема</Text>
        {themes.map(item => (
          <Pressable
            key={item.value}
            style={styles.row}
            onPress={() => setTheme(item.value)}
            accessibilityRole="radio"
            accessibilityState={{selected: theme === item.value}}>
            <Text style={styles.radio}>{theme === item.value ? '●' : '○'}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Размер шрифта</Text>
        <View style={styles.scaleRow}>
          {fontScales.map(scale => (
            <Pressable
              key={scale}
              style={[styles.scaleChip, fontScale === scale && styles.scaleChipActive]}
              onPress={() => setFontScale(scale)}
              accessibilityRole="button"
              accessibilityState={{selected: fontScale === scale}}>
              <Text style={[styles.scaleLabel, fontScale === scale && styles.scaleLabelActive]}>{scale.toFixed(1)}×</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <Text style={styles.description}>RF Codes — офлайн-справочник кодексов РФ. Данные поставляются в комплекте с приложением и не требуют подключения к сети.</Text>
        <Text style={styles.description}>Версия клиента: 0.1.0</Text>
        <Text style={styles.description}>Телеметрия отключена. Пуш-уведомления не используются.</Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontSize: 16 * fontScale,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    radio: {
      fontSize: 18 * fontScale,
      width: 28,
      color: colors.accent,
    },
    label: {
      fontSize: 16 * fontScale,
      color: colors.text,
    },
    scaleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    scaleChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
      marginBottom: 8,
    },
    scaleChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    scaleLabel: {
      fontSize: 14 * fontScale,
      color: colors.text,
    },
    scaleLabelActive: {
      color: '#ffffff',
    },
    description: {
      fontSize: 14 * fontScale,
      color: colors.secondaryText,
      marginBottom: 6,
    },
  });

export default SettingsScreen;
