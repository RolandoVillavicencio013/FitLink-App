import { Stack } from 'expo-router';
import React from 'react';



export default function RoutinesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
          title: "Detalle de Rutina"
        }}
      />
      <Stack.Screen 
        name="add-routine" 
        options={{ 
          headerShown: false,
          title: "Nueva Rutina"
        }}
      />
    </Stack>
  );
}
