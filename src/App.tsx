import React from 'react';
import {AppProvider} from './context/AppContext';
import {ThemeProvider} from './theme/ThemeProvider';
import {RouterProvider} from './navigation/Router';
import FontScaleManager from './components/FontScaleManager';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <FontScaleManager />
        <RouterProvider />
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
