import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { useRoutineForm } from '../hooks/useRoutineForm';
import { getRoutineById, updateRoutine } from '../services/repositories/routineRepository';
import { deleteRoutineExercises, insertRoutineExercises } from '../services/repositories/exerciseRepository';

interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
}

interface RawRoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise;
}

interface EditRoutineContainerProps {
  routineId: string;
}

export function useEditRoutineContainer({ routineId }: EditRoutineContainerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
    if (routineId) loadRoutineData();
  }, [routineId]);

  async function loadRoutineData() {
    try {
      setIsLoading(true);

      if (!routineId) {
        Alert.alert('Error', 'ID de rutina no válido');
        router.back();
        return;
      }

      const { routine, error } = await getRoutineById(routineId);

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
        selectedExercises: (routine.routine_exercises as unknown as RawRoutineExercise[]).map(
          (re) => re.exercises.exercise_id
        ),
        exerciseSets: Object.fromEntries(
          (routine.routine_exercises as unknown as RawRoutineExercise[]).map((re) => [
            re.exercises.exercise_id,
            re.sets.toString(),
          ])
        ),
      };
      setInitialData(loaded);
    } catch {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      router.back();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    if (!formState.validate()) return;

    if (!routineId) {
      Alert.alert('Error', 'ID de rutina no válido');
      return;
    }

    const formData = formState.getFormData();

    try {
      setIsSaving(true);

      const { error: updateError } = await updateRoutine(routineId, {
        name: formData.name,
        description: formData.description,
        estimated_time: formData.estimatedTime,
        is_shared: formData.isShared,
      });

      if (updateError) throw updateError;

      const { error: deleteError } = await deleteRoutineExercises(routineId);

      if (deleteError) throw deleteError;

      const exercises = formData.selectedExercises.map((exerciseId) => ({
        exercise_id: exerciseId,
        sets: formData.exerciseSets[exerciseId],
      }));

      const { error: insertError } = await insertRoutineExercises(
        Number(routineId),
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

  return {
    ...formState,
    handleSubmit,
    isLoading,
    isSaving,
  };
}
