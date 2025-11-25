import { useRouter } from 'expo-router';
import { supabase } from '../../../services/supabase';
import RoutineForm from '../../../components/RoutineForm';
import { useRoutineForm } from '../../../hooks/useRoutineForm';

export default function AddRoutineScreen() {
  const router = useRouter();
  const formState = useRoutineForm();

  async function handleAddRoutine() {
    if (!formState.validate()) return;

    const formData = formState.getFormData();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: current_user, error: current_user_error } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();

    if (current_user_error || !current_user) {
      console.error(current_user_error);
      return;
    }

    const { data: routineData, error } = await supabase
      .from('routines')
      .insert([
        {
          name: formData.name,
          description: formData.description,
          estimated_time: formData.estimatedTime,
          user_id: current_user.user_id,
          is_shared: formData.isShared,
        },
      ])
      .select('routine_id')
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (!routineData) {
      console.error("No se devolvió routineData");
      return;
    }

    const routineId = routineData.routine_id;
    const routineExercises = formData.selectedExercises.map((exerciseId) => ({
      routine_id: routineId,
      exercise_id: exerciseId,
      sets: formData.exerciseSets[exerciseId],
    }));

    const { error: routineExercisesError } = await supabase
      .from('routine_exercises')
      .insert(routineExercises);

    if (routineExercisesError) {
      console.error(routineExercisesError);
    } else {
      router.replace("/(tabs)/routines");
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