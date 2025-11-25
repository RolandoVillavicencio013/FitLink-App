import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Alert, Platform, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import RoutineForm from '../../../../components/RoutineForm';
import { useRoutineForm } from '../../../../hooks/useRoutineForm';
import { theme } from '../../../../constants/theme';
import { getRoutineById, updateRoutine } from '../../../../services/repositories/routineRepository';
import { deleteRoutineExercises, insertRoutineExercises } from '../../../../services/repositories/exerciseRepository';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [initialData, setInitialData] = useState({
    name: '',
    description: '',
    estimatedTime: '',
    isShared: false,
    selectedExercises: [] as number[],
    exerciseSets: {} as { [key: number]: string },
  });

  const formState = useRoutineForm({ initialData });

  useEffect(() => {
    if (id) loadRoutineData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSaving || !formState.hasChanges()) {
        return;
      }

      e.preventDefault();

      if (Platform.OS === 'web') {
        const confirmed = window.confirm('Hay cambios sin guardar. ¿Deseas salir?');
        if (confirmed) {
          navigation.dispatch(e.data.action);
        }
      } else {
        Alert.alert(
          'Cambios sin guardar',
          '¿Deseas salir sin guardar los cambios?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, formState, isSaving]);

  async function loadRoutineData() {
    try {
      setLoading(true);
      
      if (!id) {
        Alert.alert('Error', 'ID de rutina no válido');
        router.back();
        return;
      }

      const { routine, error } = await getRoutineById(id);

      if (error || !routine) {
        Alert.alert('Error', 'No se pudo cargar la rutina');
        router.back();
        return;
      }

      const loaded = {
        name: routine.name,
        description: routine.description,
        estimatedTime: routine.estimated_time.toString(),
        isShared: routine.is_shared,
        selectedExercises: routine.routine_exercises.map((re: any) => re.exercises.exercise_id),
        exerciseSets: Object.fromEntries(
          routine.routine_exercises.map((re: any) => [re.exercises.exercise_id, re.sets.toString()])
        ),
      };
      setInitialData(loaded);
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!formState.validate()) return;

    if (!id) {
      Alert.alert('Error', 'ID de rutina no válido');
      return;
    }

    const formData = formState.getFormData();

    try {
      setIsSaving(true);
      
      const { error: updateError } = await updateRoutine(id, {
        name: formData.name,
        description: formData.description,
        estimated_time: formData.estimatedTime,
        is_shared: formData.isShared,
      });

      if (updateError) throw updateError;

      const { error: deleteError } = await deleteRoutineExercises(id);

      if (deleteError) throw deleteError;

      const exercises = formData.selectedExercises.map((exerciseId) => ({
        exercise_id: exerciseId,
        sets: formData.exerciseSets[exerciseId],
      }));

      const { error: insertError } = await insertRoutineExercises(
        Number(id),
        exercises
      );

      if (insertError) throw insertError;

      if (Platform.OS === 'web') {
        window.alert('Rutina actualizada exitosamente');
      } else {
        Alert.alert('Éxito', 'Rutina actualizada exitosamente');
      }

      router.back();
    } catch (error) {
      setIsSaving(false);
      console.error('Error al actualizar rutina:', error);
      if (Platform.OS === 'web') {
        window.alert('Error al actualizar la rutina');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la rutina');
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </View>
    );
  }

  return (
    <RoutineForm
      {...formState}
      onSubmit={handleUpdate}
      submitLabel="Guardar cambios"
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginTop: 10,
  },
});
