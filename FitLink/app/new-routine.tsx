import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../services/supabase';

export default function AddRoutineScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  async function handleAddRoutine() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('routines')
      .insert([
        {
          name,
          description,
          estimated_time: Number(estimatedTime),
          user_id: user.id,
          is_shared: false,
        },
      ]);

    if (error) {
      console.error(error);
    } else {
      // volver a la lista de rutinas
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Tiempo estimado (min)"
        keyboardType="numeric"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
      />
      <Button title="Guardar rutina" onPress={handleAddRoutine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
});