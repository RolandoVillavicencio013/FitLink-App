import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../services/supabase';
import { theme } from '../../../constants/theme';
import CustomButton from '../../../components/CustomButton';
import { Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


// Para arrays, especificar el tipo de elementos que contiene
interface RoutineExercisePreview {
  exercise_id: number;
}

interface routine{
  routine_id: number;
  name: string;
  description: string;
  is_shared: boolean;
  created_at: string;
  user_id: string;
  estimated_time: number;
  routine_exercises: RoutineExercisePreview[];
}

export default function RoutinesScreen() {
  const router = useRouter();
  const [routines, setRoutines] = useState<routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  async function loadRoutines() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (usersError || !users) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
    .from('routines')
    .select(`
      routine_id,
      name,
      description,
      is_shared,
      created_at,
      user_id,
      estimated_time,
      routine_exercises (
        exercise_id
      )
    `)
    .eq('user_id', users.user_id)
    .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRoutines(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRoutines}
        keyExtractor={(item) => item.routine_id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => {
              // @ts-ignore
              router.push(`/routines/${item.routine_id}`);
            }}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.exercises}>
              {'Cantidad de ejercicios: ' + (item.routine_exercises?.length ?? 0)}
            </Text>
            <Text style={styles.time}>
              {'Tiempo estimado: ' + item.estimated_time + ' minutos'}
            </Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar rutina..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        }
      />
      <CustomButton
        label="Agregar rutina"
        onPress={() => router.push('/routines/add-routine')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 10,
    borderWidth: 2,                    
    marginBottom: 10,
    padding: 15,
  },
  center: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  container: { flex: 1, marginBottom: -25, maxHeight: 580, padding: 20},
  exercises: {
    color: theme.colors.textSecondary, 
    fontFamily: "Roboto_400Regular", 
    fontSize: 16, 
    marginBottom: 4
  },
  searchInput: {
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    width: '100%',
  },
  time: {
    color: theme.colors.textSecondary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16
  },
  title: { color: theme.colors.textPrimary,
    fontFamily: "Roboto_400Regular",
    fontSize: 16, fontWeight: 'bold',
    marginBottom: 8
  }
});
