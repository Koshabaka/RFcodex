import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useThemeColors} from '../theme/colors';
import {useAppContext} from '../context/AppContext';

interface SearchInputProps {
  value: string;
  onChangeText(value: string): void;
  placeholder?: string;
  onSubmit(): void;
  onClear(): void;
}

const SearchInput: React.FC<SearchInputProps> = ({value, onChangeText, placeholder, onSubmit, onClear}) => {
  const colors = useThemeColors();
  const {
    state: {fontScale},
  } = useAppContext();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        accessibilityLabel="Поле поиска"
      />
      {value.length > 0 && (
        <Pressable accessibilityRole="button" accessibilityLabel="Очистить" onPress={onClear}>
          <Text style={styles.clear}>×</Text>
        </Pressable>
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      fontSize: 16 * fontScale,
      color: colors.text,
    },
    clear: {
      fontSize: 24 * fontScale,
      paddingHorizontal: 8,
      color: colors.secondaryText,
    },
  });

export default SearchInput;
