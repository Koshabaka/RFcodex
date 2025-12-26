import {useResolvedTheme} from '../context/AppContext';

const palette = {
  light: {
    background: '#f3f4f6',
    surface: '#ffffff',
    text: '#111111',
    secondaryText: '#555555',
    accent: '#0a66c2',
    border: '#dddddd',
  },
  dark: {
    background: '#0d1117',
    surface: '#161b22',
    text: '#f0f6fc',
    secondaryText: '#a1b1c7',
    accent: '#58a6ff',
    border: '#30363d',
  },
};

export function useThemeColors() {
  const theme = useResolvedTheme();
  return palette[theme];
}
