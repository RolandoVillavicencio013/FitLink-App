import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Navega a la primera tab después de login
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la pantalla de Login</Text>
      <Button title="Ingresar" onPress={handleLogin} />
      <Button title="Ir a Registro" onPress={() => router.push('/register')} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginBottom: 20,
    fontSize: 18
  }
});
