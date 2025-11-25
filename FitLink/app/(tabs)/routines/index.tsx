import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../constants/theme';
import CustomButton from '../../../components/CustomButton';
import { Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../../services/supabase';
import { getRoutinesByUserId } from '../../../services/repositories/routineRepository';


// Para arrays, especificar el tipo de elementos que contiene
interface RoutineExercisePreview {
  exercise_id: number;
}

interface Routine {
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
  const [routines, setRoutines] = useState<Routine[]>([]);
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
    try {
      setLoading(true);
      
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

      const { routines: data, error } = await getRoutinesByUserId(users.user_id);

      if (error) {
        console.error(error);
      } else {
        setRoutines(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
            onPress={() => router.push(`/(tabs)/routines/${item.routine_id}`)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.exercises}>
              Cantidad de ejercicios: {item.routine_exercises?.length ?? 0}
            </Text>
            <Text style={styles.time}>
              Tiempo estimado: {item.estimated_time} minutos
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
  container: { 
    backgroundColor: theme.colors.background,
    flex: 1, 
    padding: 20
  },
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
