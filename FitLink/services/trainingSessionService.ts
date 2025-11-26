import { supabase } from "./supabase";
import { FinalizedSet } from "@/components/views/TrainingSessionView";

export async function fetchRoutine(routineId: string) {
  return supabase
    .from("routines")
    .select(
      `
      *,
      routine_exercises (
        routine_exercise_id,
        order,
        sets,
        exercise_id,
        exercises ( name )
      )
    `
    )
    .eq("routine_id", routineId)
    .single();
}

export async function endSession(
  routineId: string,
  payload: FinalizedSet[],
  duration: number
): Promise<boolean> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return false;

    const { data: userRow } = await supabase
      .from("users")
      .select("user_id")
      .eq("auth_id", user.id)
      .single();
    if (!userRow) return false;

    const { data: session } = await supabase
      .from("training_sessions")
      .insert({
        user_id: userRow.user_id,
        routine_id: routineId,
        duration,
        date: new Date().toISOString(),
      })
      .select()
      .single();
    if (!session) return false;

    const { error: setsError } = await supabase
      .from("session_exercise_sets")
      .insert(
        payload.map((set) => ({
          training_session_id: session.training_session_id,
          routine_exercise_id: set.routineExerciseId,
          order: set.serieIndex,
          weight: set.previous ? 0 : set.weight,
          reps: set.previous ? 0 : set.reps,
        }))
      );

    return !setsError;
  } catch {
    return false;
  }
}
