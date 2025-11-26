import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import { getRoutineById } from '../services/repositories/routineRepository';
import { deleteRoutine } from '../services/delete-routine';

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

export interface RoutineDetail {
  routine_id: number;
  name: string;
  description: string;
  estimated_time: number;
  created_at: string;
  is_shared: boolean;
  routine_exercises: RoutineExercise[];
}

interface RawRoutineExercise {
  routine_exercise_id: number;
  order: number;
  sets: number;
  exercises: Exercise;
}

export const useRoutineDetailContainer = (routineId: string | undefined) => {
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (routineId) loadRoutineDetail();
    }, [routineId])
  );

  async function loadRoutineDetail() {
    try {
      setLoading(true);

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

      // Ordenar ejercicios por 'order'
      if (routine.routine_exercises) {
        (routine.routine_exercises as unknown as RawRoutineExercise[]).sort(
          (a, b) => a.order - b.order
        );
      }

      const processedData: RoutineDetail = {
        ...routine,
        routine_exercises:
          (routine.routine_exercises as unknown as RawRoutineExercise[])?.map((re) => ({
            routine_exercise_id: re.routine_exercise_id,
            order: re.order,
            sets: re.sets,
            exercises: re.exercises || null,
          })) || [],
      };

      setRoutine(processedData);
    } catch {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    router.push(`/(tabs)/routines/edit-routine/${routineId}`);
  };

  const handleDelete = () => {
    deleteRoutine({
      routineId: routineId as string,
      onSuccess: () => router.back(),
    });
  };

  return {
    routine,
    loading,
    handleEdit,
    handleDelete,
  };
};