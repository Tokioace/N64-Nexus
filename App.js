import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import EventScreen from './src/screens/EventScreen';

const theme = {
  colors: {
    primary: '#FF6B35',
    accent: '#4ECDC4',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    placeholder: '#888888',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <EventScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}