import { Stack } from 'expo-router';
import React from 'react';

const RootLayout: React.FC = () => {
  return <RootLayoutNav />;
};

const RootLayoutNav: React.FC = () => {
  return (
    <Stack>
      {/* Pantallas públicas */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />

      {/* Pantallas privadas dentro de tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal opcional */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export default RootLayout;
