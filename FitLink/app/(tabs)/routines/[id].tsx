import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../services/supabase';
import { theme } from '../../../constants/theme';

// Tipos de datos
interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
}
interface RoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise | null;
}
interface RoutineDetail {
  routine_id: number;
  name: string;
  description: string;
  estimated_time: number;
  routine_exercises: RoutineExercise[];
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRoutineDetail();
    }
  }, [id]);

  async function loadRoutineDetail() {
    setLoading(true);
    const { data } = await supabase
      .from('routines')
      .select(`routine_id,name,description,estimated_time,routine_exercises (routine_exercise_id,order,sets,exercises (exercise_id,name,description))`)
      .eq('routine_id', id)
      .single();
    setRoutine(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Cargando rutina...</Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la rutina</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text>{routine.estimated_time} minutos</Text>
        <Text>{routine.description || 'Sin descripción'}</Text>
      </View>
      <View>
        <Text>Ejercicios:</Text>
        {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
          routine.routine_exercises.map((exercise) => (
            <View key={exercise.routine_exercise_id} style={styles.exerciseCard}>
              <Text>{exercise.exercises?.name || 'Ejercicio sin nombre'}</Text>
              <Text>Series: {exercise.sets}</Text>
            </View>
          ))
        ) : (
          <Text>No hay ejercicios en esta rutina</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { marginBottom: 20, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary },
  exerciseCard: { marginBottom: 16, padding: 10, backgroundColor: theme.colors.surface },
});