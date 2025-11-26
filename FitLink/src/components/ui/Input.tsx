import { FC, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps } from 'react-native';
import { theme } from '../../constants/theme';

type ValidationRule = (value: string) => string;

interface InputProps extends Omit<TextInputProps, 'onChangeText' | 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rules?: ValidationRule[];
  error?: string;
}

export const Input: FC<InputProps> = ({ 
  label, 
  value,
  onChange, 
  rules, 
  error,
  placeholder,
  ...textInputProps 
}) => {
  const [internalError, setInternalError] = useState('');

  const onChangeText = (inputValue: string) => {
    // actualizar el valor primero (permitir escribir)
    onChange(inputValue);
    
    // Luego validar y mostrar errores
    let errorMessage = "";

    if (rules) {
      for (const rule of rules) {
        errorMessage = rule(inputValue);
        if (errorMessage) break;
      }
    }

    setInternalError(errorMessage);
  };

  const displayError = error || internalError;

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[styles.input, displayError ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      {displayError && <Text style={styles.error}>{displayError}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    color: theme.colors.error || '#ff6b6b',
    fontSize: 14,
    marginBottom: 15,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    marginBottom: 20,
    padding: 12,
  },
  inputError: {
    borderColor: theme.colors.error || '#ff6b6b',
    marginBottom: 5,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});