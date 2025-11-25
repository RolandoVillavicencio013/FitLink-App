import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import RoutineForm from '../../../components/RoutineForm';
import { useRoutineForm } from '../../../hooks/useRoutineForm';
import { supabase } from '../../../services/supabase';
import { createRoutine } from '../../../services/repositories/routineRepository';
import { insertRoutineExercises } from '../../../services/repositories/exerciseRepository';

export default function AddRoutineScreen() {
  const router = useRouter();
  const formState = useRoutineForm();

  async function handleAddRoutine() {
    if (!formState.validate()) return;

    const formData = formState.getFormData();

    try {
      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        if (Platform.OS === 'web') {
          window.alert('Usuario no autenticado');
        } else {
          Alert.alert('Error', 'Usuario no autenticado');
        }
        return;
      }

      // Obtener user_id de la tabla users
      const { data: dbUser, error: dbUserError } = await supabase
        .from("users")
        .select("user_id")
        .eq("auth_id", user.id)
        .single();

      if (dbUserError || !dbUser) {
        console.error(dbUserError);
        if (Platform.OS === 'web') {
          window.alert('Error al obtener datos del usuario');
        } else {
          Alert.alert('Error', 'No se pudieron obtener tus datos');
        }
        return;
      }

      const { routine, error: routineError } = await createRoutine(dbUser.user_id, {
        name: formData.name,
        description: formData.description,
        estimated_time: formData.estimatedTime,
        is_shared: formData.isShared,
      });

      if (routineError || !routine) {
        console.error(routineError);
        if (Platform.OS === 'web') {
          window.alert('Error al crear la rutina');
        } else {
          Alert.alert('Error', 'No se pudo crear la rutina');
        }
        return;
      }

      const exercises = formData.selectedExercises.map((exerciseId) => ({
        exercise_id: exerciseId,
        sets: formData.exerciseSets[exerciseId],
      }));

      const { error: exercisesError } = await insertRoutineExercises(
        routine.routine_id,
        exercises
      );

      if (exercisesError) {
        console.error(exercisesError);
        if (Platform.OS === 'web') {
          window.alert('Error al agregar ejercicios');
        } else {
          Alert.alert('Error', 'No se pudieron agregar los ejercicios');
        }
        return;
      }

      router.replace("/(tabs)/routines");
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'web') {
        window.alert('Error inesperado');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    }
  }

  return (
    <RoutineForm
      {...formState}
      onSubmit={handleAddRoutine}
      submitLabel="Guardar rutina"
    />
  );
}