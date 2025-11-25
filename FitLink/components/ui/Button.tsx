import React, { FC } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false 
}) => {
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.buttonDisabled];
    return variant === 'primary' 
      ? [styles.button, styles.buttonPrimary]
      : [styles.button, styles.buttonSecondary];
  };

  const getTextStyle = () => {
    return variant === 'primary' 
      ? [styles.text, styles.textPrimary]
      : [styles.text, styles.textSecondary];
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          ...getButtonStyle(),
          pressed && !disabled && styles.buttonPressed,
        ]}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.divider || '#ccc',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
  },
  container: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: theme.colors.textPrimary,
  },
});