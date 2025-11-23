import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
}

export default function CustomButton({ label, onPress }: CustomButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    marginBottom: 20,
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryHover,
  },
  text: {
    color: '#fff',
    fontFamily: "Roboto_400Regular",
    fontSize: 16.5,
    fontWeight: 500,
  },
});