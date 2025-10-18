import React from 'react';
import {Appearance, ColorSchemeName, useColorScheme} from 'react-native';
import {useAppContext} from '../context/AppContext';

export const ThemeContext = React.createContext({
  colorScheme: 'light' as ColorSchemeName,
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const systemScheme = useColorScheme() || Appearance.getColorScheme() || 'light';
  const {
    state: {theme},
  } = useAppContext();
  const colorScheme = theme === 'system' ? systemScheme : theme;
  return <ThemeContext.Provider value={{colorScheme}}>{children}</ThemeContext.Provider>;
};
