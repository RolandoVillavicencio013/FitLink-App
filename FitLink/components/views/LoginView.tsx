import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginContainer } from '../../containers/LoginContainer';
import { LoginForm } from '../forms/LoginForm';
import { theme } from '../../constants/theme';

export const LoginView: React.FC = () => {
  const {
    formData,
    errors,
    loading,
    updateField,
    handleLogin,
    navigateToRegister,
  } = useLoginContainer();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LoginForm
          email={formData.email}
          password={formData.password}
          emailError={errors.email}
          passwordError={errors.password}
          loading={loading}
          onEmailChange={(value) => updateField('email', value)}
          onPasswordChange={(value) => updateField('password', value)}
          onLogin={handleLogin}
          onNavigateToRegister={navigateToRegister}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});