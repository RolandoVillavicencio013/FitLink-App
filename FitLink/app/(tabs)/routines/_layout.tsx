import { Stack } from 'expo-router';
import React from 'react';
import { theme } from '../../../constants/theme';

export default function RoutinesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          color: theme.colors.textPrimary,
          fontFamily: 'Roboto_500Medium',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: true,
          title: "Detalle de Rutina"
        }}
      />
      <Stack.Screen 
        name="add-routine" 
        options={{ 
          headerShown: true,
          title: "Nueva Rutina"
        }}
      />
      <Stack.Screen 
        name="edit-routine/[id]" 
        options={{ 
          headerShown: true,
          title: "Editar Rutina"
        }}
      />
    </Stack>
  );
}
