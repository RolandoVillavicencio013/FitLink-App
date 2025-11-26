import { supabase } from '../supabase';

export async function getRoutinesByUserId(userId: number) {
  const { data, error } = await supabase
    .from('routines')
    .select(`
      routine_id,
      name,
      description,
      is_shared,
      created_at,
      user_id,
      estimated_time,
      routine_exercises (
        exercise_id
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { routines: data, error };
}

export async function getRoutineById(routineId: string) {
  const { data, error } = await supabase
    .from('routines')
    .select(`
      routine_id,
      name,
      description,
      created_at,
      estimated_time,
      is_shared,
      routine_exercises (
        routine_exercise_id,
        order,
        sets,
        exercises (
          exercise_id,
          name,
          description
        )
      )
    `)
    .eq('routine_id', routineId)
    .single();

  return { routine: data, error };
}

export async function createRoutine(userId: number, routineData: {
  name: string;
  description: string;
  estimated_time: number;
  is_shared: boolean;
}) {
  const { data, error } = await supabase
    .from('routines')
    .insert({ ...routineData, user_id: userId })
    .select()
    .single();

  return { routine: data, error };
}

export async function updateRoutine(routineId: string, routineData: {
  name: string;
  description: string;
  estimated_time: number;
  is_shared: boolean;
}) {
  const { error } = await supabase
    .from('routines')
    .update(routineData)
    .eq('routine_id', routineId);

  return { error };
}

export async function deleteRoutine(routineId: string) {
  const { error } = await supabase
    .from('routines')
    .delete()
    .eq('routine_id', routineId);

  return { error };
}
