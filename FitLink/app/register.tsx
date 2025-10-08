import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Register: React.FC = () => {
  const router = useRouter();

  const handleRegister = () => {
    // Navega a la primera tab después de registro
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la pantalla de Registro</Text>
      <Button title="Registrar" onPress={handleRegister} />
      <Button title="Ir a Login" onPress={() => router.push('/login')} />
    </View>
  );
};

export default Register;

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
