import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { useRoutineForm } from '../hooks/useRoutineForm';
import { supabase } from '../services/supabase';
import { createRoutine } from '../services/repositories/routineRepository';
import { insertRoutineExercises } from '../services/repositories/exerciseRepository';

// Tipos auxiliares
type SupabaseUser = { id: string } | null;
type SupabaseError = { message?: string } | null;
type DbUser = { user_id: number } | null;
type Routine = { routine_id: number } | null;
type RoutineError = { message?: string } | string | null;
type ExercisesError = { message?: string } | string | null;

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else {
    Alert.alert(title, message);
  }
}

function isUserInvalid(user: SupabaseUser, error: SupabaseError): boolean {
  return !!error || !user;
}

function isDbUserInvalid(dbUser: DbUser, error: SupabaseError): boolean {
  return !!error || !dbUser;
}

function isRoutineInvalid(routine: Routine, error: RoutineError): boolean {
  return !!error || !routine;
}

function hasExercisesError(error: ExercisesError): boolean {
  return !!error;
}

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

async function getDbUser(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("user_id")
    .eq("auth_id", userId)
    .single();
  return { dbUser: data as DbUser, error };
}

type AddRoutineFormData = {
  name: string;
  description: string;
  estimatedTime: number;
  isShared: boolean;
  selectedExercises: number[];
  exerciseSets: { [exerciseId: number]: number };
};

async function createRoutineAndExercises(userId: number, formData: AddRoutineFormData) {
  const { routine, error: routineError } = await createRoutine(userId, {
    name: formData.name,
    description: formData.description,
    estimated_time: formData.estimatedTime,
    is_shared: formData.isShared,
  });
  if (isRoutineInvalid(routine, routineError)) {
    return { error: routineError || 'No se pudo crear la rutina o ejercicios' };
  }

  const exercises = formData.selectedExercises.map((exerciseId: number) => ({
    exercise_id: exerciseId,
    sets: formData.exerciseSets[exerciseId],
  }));

  const { error: exercisesError } = await insertRoutineExercises(
    routine!.routine_id,
    exercises
  );
  if (hasExercisesError(exercisesError)) {
    return { error: exercisesError || 'No se pudo agregar los ejercicios' };
  }

  return { routine };
}

export function useAddRoutineContainer() {
  const router = useRouter();
  const formState = useRoutineForm();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(true);

  async function handleSubmit() {
    if (!formState.validate()) return;

    const formData = formState.getFormData();
    setIsLoading(true);

    try {
      // Obtener usuario actual
      const { user, error: userError } = await getCurrentUser();
      if (isUserInvalid(user, userError)) {
        showAlert('Error', 'Usuario no autenticado');
        return;
      }

      // Obtener user_id de la tabla users
      const { dbUser, error: dbUserError } = await getDbUser(user!.id);
      if (isDbUserInvalid(dbUser, dbUserError)) {
        console.error(dbUserError);
        showAlert('Error', 'No se pudieron obtener tus datos');
        return;
      }

      // Crear rutina y ejercicios
      const result = await createRoutineAndExercises(dbUser!.user_id, formData);
      if (result.error) {
        console.error(result.error);
        showAlert('Error', typeof result.error === 'string' ? result.error : 'No se pudo crear la rutina o ejercicios');
        return;
      }

      setShouldBlockNavigation(false);
      router.replace("/(tabs)/routines");
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    ...formState,
    handleSubmit,
    isLoading,
    shouldBlockNavigation,
  };
}
