import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import RoutineForm from '../../../components/RoutineForm';
import { useRoutineForm } from '../../../hooks/useRoutineForm';
import { useAuth } from '../../../hooks/useAuth';
import { createRoutine } from '../../../services/repositories/routineRepository';
import { insertRoutineExercises } from '../../../services/repositories/exerciseRepository';

export default function AddRoutineScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const formState = useRoutineForm();

  async function handleAddRoutine() {
    if (!formState.validate()) return;

    if (!userId) {
      if (Platform.OS === 'web') {
        window.alert('Usuario no autenticado');
      } else {
        Alert.alert('Error', 'Usuario no autenticado');
      }
      return;
    }

    const formData = formState.getFormData();

    try {
      const { routine, error: routineError } = await createRoutine(userId, {
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