import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../services/supabase';
import { theme } from '../../../constants/theme';
import CustomButton from '../../../components/CustomButton';

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
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadRoutineDetail(); }, [id]);

  async function loadRoutineDetail() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('routines')
        .select(`routine_id,name,description,estimated_time,routine_exercises (routine_exercise_id,order,sets,exercises (exercise_id,name,description))`)
        .eq('routine_id', id)
        .single();
      if (error) {
        Alert.alert('Error', 'No se pudo cargar la rutina');
        router.back();
        return;
      }
      setRoutine(data);
    } catch {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleGoBack = () => router.back();
  const handleEdit = () => Alert.alert('En desarrollo', 'La función de editar aún no está implementada');
  const handleDelete = () => Alert.alert('En desarrollo', 'La función de eliminar aún no está implementada');

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
        <CustomButton label="Volver" onPress={handleGoBack} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text>{routine.estimated_time} minutos</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text>{routine.description || 'Sin descripción'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ejercicios</Text>
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
      <View style={styles.buttonsContainer}>
        <CustomButton label="Editar rutina" onPress={handleEdit} />
        <CustomButton label="Eliminar rutina" onPress={handleDelete} />
        <CustomButton label="Volver al listado" onPress={handleGoBack} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { marginBottom: 20, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textPrimary },
  section: { marginBottom: 25, paddingHorizontal: 20 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
  exerciseCard: { marginBottom: 16, padding: 10, backgroundColor: theme.colors.surface },
  buttonsContainer: { marginTop: 20, gap: 12, paddingHorizontal: 20, paddingBottom: 20 }
});