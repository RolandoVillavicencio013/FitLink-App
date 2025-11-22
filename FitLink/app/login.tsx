import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { theme } from "../constants/theme";
import { loginUser } from "../services/authService";

const Login: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {

      if (!email || !password) {
        alert("Todos los campos son obligatorios");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Correo electrónico inválido");
        return;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const user = await loginUser(email, password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
        if (err.message.includes("Invalid login credentials")) {
          alert("Credenciales inválidas");
        } else {
          alert("Error en login");
        }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={{ marginBottom: 10 }}>
        <Button
          title="Ingresar"
          onPress={handleLogin}
          color={theme.colors.primary}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Ir a registro"
          onPress={() => router.push("/register")}
          color={theme.colors.surface}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
});
