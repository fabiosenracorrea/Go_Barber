import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppRoutes from './routes';
import AppProvider from './hooks';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#312e38" barStyle="light-content" />
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
