import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';
import {updateProvider} from '../data/update/updateProvider';
import {useThemeColors} from '../theme/colors';
import {useAppContext} from '../context/AppContext';

interface Props {
  onClose(): void;
}

type Status = 'idle' | 'checking' | 'offline' | 'upToDate' | 'updateAvailable';

const UpdatesScreen: React.FC<Props> = ({onClose}) => {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('Проверка выполняется вручную.');
  const colors = useThemeColors();
  const {
    state: {fontScale},
  } = useAppContext();
  const styles = React.useMemo(() => createStyles(colors, fontScale), [colors, fontScale]);

  const checkUpdates = async () => {
    setStatus('checking');
    setMessage('Проверка обновлений…');
    try {
      const result = await updateProvider.check();
      if (result.hasUpdate) {
        setStatus('updateAvailable');
        setMessage(result.message);
      } else {
        setStatus('upToDate');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('offline');
      setMessage('Не удалось проверить обновления. Проверьте подключение к сети.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Обновления" onBack={onClose} />
      <View style={styles.content}>
        <Text style={styles.statusLabel}>Статус: {statusLabel(status)}</Text>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
          onPress={checkUpdates}
          accessibilityRole="button"
          accessibilityLabel="Проверить обновления">
          <Text style={styles.buttonText}>Проверить обновления</Text>
        </Pressable>
        <Text style={styles.note}>
          Источник обновлений реализуется через `UpdateProvider`. Для подключения сервера
          реализуйте класс, удовлетворяющий интерфейсу, и замените `updateProvider`.
        </Text>
      </View>
    </SafeAreaView>
  );
};

function statusLabel(status: Status) {
  switch (status) {
    case 'idle':
      return 'Ожидание';
    case 'checking':
      return 'Проверка';
    case 'offline':
      return 'Нет соединения';
    case 'upToDate':
      return 'Актуально';
    case 'updateAvailable':
      return 'Доступно обновление';
    default:
      return '—';
  }
}

const createStyles = (colors: ReturnType<typeof useThemeColors>, fontScale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    statusLabel: {
      fontSize: 16 * fontScale,
      fontWeight: '600',
      marginBottom: 12,
      color: colors.text,
    },
    message: {
      fontSize: 14 * fontScale,
      color: colors.secondaryText,
      marginBottom: 24,
    },
    button: {
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: 'center',
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16 * fontScale,
      fontWeight: '600',
    },
    note: {
      marginTop: 24,
      fontSize: 12 * fontScale,
      color: colors.secondaryText,
    },
  });

export default UpdatesScreen;
