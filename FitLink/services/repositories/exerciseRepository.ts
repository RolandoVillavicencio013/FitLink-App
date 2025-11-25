import { supabase } from '../supabase';

export async function getAllExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('exercise_id, name');

  return { exercises: data, error };
}

export async function insertRoutineExercises(routineId: number, exercises: Array<{
  exercise_id: number;
  sets: number;
}>) {
  const routineExercises = exercises.map(ex => ({
    routine_id: routineId,
    exercise_id: ex.exercise_id,
    sets: ex.sets,
  }));

  const { error } = await supabase
    .from('routine_exercises')
    .insert(routineExercises);

  return { error };
}

export async function deleteRoutineExercises(routineId: string) {
  const { error } = await supabase
    .from('routine_exercises')
    .delete()
    .eq('routine_id', routineId);

  return { error };
}
