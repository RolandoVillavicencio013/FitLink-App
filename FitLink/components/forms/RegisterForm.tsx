import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from '../ui';
import { theme } from '../../constants/theme';
import * as validation from '../../utils/validations';

interface RegisterFormProps {
  fullName: string;
  email: string;
  username: string;
  password: string;
  fullNameError?: string;
  emailError?: string;
  usernameError?: string;
  passwordError?: string;
  loading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  fullName,
  email,
  username,
  password,
  fullNameError,
  emailError,
  usernameError,
  passwordError,
  loading,
  onFullNameChange,
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  onRegister,
  onNavigateToLogin,
}) => {
  return (
    <>
      <Text style={styles.title}>Registro</Text>
      
      <Input
        placeholder="Nombre completo"
        rules={[validation.required('El nombre completo es obligatorio')]}
        value={fullName}
        onChange={onFullNameChange}
        error={fullNameError}
      />

      <Input
        placeholder="Correo electrónico"
        rules={[validation.required('El correo electrónico es obligatorio'), validation.email()]}
        value={email}
        onChange={onEmailChange}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Nombre de usuario"
        rules={[validation.required('El nombre de usuario es obligatorio')]}
        value={username}
        onChange={onUsernameChange}
        error={usernameError}
      />

      <Input
        placeholder="Contraseña"
        rules={[validation.required('La contraseña es obligatoria'), validation.minLength(6, 'La contraseña debe tener al menos 6 caracteres')]}
        value={password}
        onChange={onPasswordChange}
        error={passwordError}
        secureTextEntry
      />

      <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={onRegister}
        disabled={loading}
      />

      <View style={styles.spacer} />

      <Button
        title="Ya tengo cuenta"
        onPress={onNavigateToLogin}
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