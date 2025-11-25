import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from '../ui';
import { theme } from '../../constants/theme';

interface LoginFormProps {
  email: string;
  password: string;
  emailError?: string;
  passwordError?: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  emailError,
  passwordError,
  loading,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onNavigateToRegister,
}) => {
  return (
    <>
      <Text style={styles.title}>Iniciar sesion</Text>
      
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChange={onEmailChange}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Contraseña"
        value={password}
        onChange={onPasswordChange}
        error={passwordError}
        secureTextEntry
      />

      <Button
        title={loading ? "Ingresando..." : "Ingresar"}
        onPress={onLogin}
        disabled={loading}
      />

      <View style={styles.spacer} />

      <Button
        title="Ir a registro"
        onPress={onNavigateToRegister}
        variant="secondary"
      />
    </>
  );
};

const styles = StyleSheet.create({
  spacer: {
    marginTop: 10,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});