import { FinalizedSet, Routine } from "@/components/views/TrainingSessionView";

type SerieState = { weight?: string; reps?: string; done: boolean };

export function buildFinalizedSets(
  routine: Routine,
  perExerciseState: Record<string | number, Record<number, SerieState>>
): FinalizedSet[] {
  const allSets: FinalizedSet[] = [];

  for (const exercise of routine.routine_exercises) {
    for (let serie = 1; serie <= exercise.sets; serie++) {
      const serieState =
        perExerciseState[exercise.routine_exercise_id]?.[serie] ?? { done: false };

      allSets.push({
        routineExerciseId: exercise.routine_exercise_id,
        serieIndex: serie,
        reps: serieState.done ? Number(serieState.reps ?? 0) : 0,
        weight: serieState.done ? Number(serieState.weight ?? 0) : 0,
        previous: !serieState.done,
      });
    }
  }

  return allSets;
}
