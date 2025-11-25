import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function CustomButton({ label, onPress, disabled = false }: CustomButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.5,
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
  textDisabled: {
    color: theme.colors.textSecondary,
  },
});