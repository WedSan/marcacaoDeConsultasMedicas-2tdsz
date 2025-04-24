import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';
import { AppNavigator } from './src/screens/Navigator';
import theme from './src/styles/theme';
import { StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthenticationProvider } from './src/components/context/AuthenticationContext';
export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações não concedida!');
      }
    };
    requestPermissions();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthenticationProvider>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={theme.colors.primary} 
          />
          <AppNavigator />
      </AuthenticationProvider>
    </ThemeProvider>
  );
}
