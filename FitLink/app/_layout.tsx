import { Stack } from 'expo-router';
import React from 'react';
import { theme } from '../constants/theme';

const RootLayout: React.FC = () => {
  return <RootLayoutNav />;
};

const RootLayoutNav: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      {/* Pantallas públicas */}
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />

      {/* Pantallas privadas dentro de tabs */}
      <Stack.Screen name="(tabs)" />

      {/* Modal opcional */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export default RootLayout;
