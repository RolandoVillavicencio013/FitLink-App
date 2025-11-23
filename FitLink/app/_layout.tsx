import { Stack } from 'expo-router';
import React from 'react';
import { theme } from '../constants/theme';
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { ActivityIndicator, View } from "react-native";

const RootLayout: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
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
    </Stack>
  );
};

export default RootLayout;
